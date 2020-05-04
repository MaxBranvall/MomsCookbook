using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using api.Entities;
using api.Models;
using api.Helpers;
using api.Contexts;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Services
{

    public class UserService : IUserService
    {

        private PasswordHasher<Users> _passwordHasher;
        private RecipeContext _context;
        private readonly AppSettings _appSettings;
        private readonly ILogger<UserService> _logger;

        public UserService(IOptions<AppSettings> appSettings, ILogger<UserService> logger, RecipeContext context)
        {
            _appSettings = appSettings.Value;
            _logger = logger;
            _context = context;
            _passwordHasher = new PasswordHasher<Users>();
        }

        public Users Authenticate(string username, string password)
        {
            var user = _context.users.SingleOrDefault(x => x.Username == username);

            if (user == null)
            {
                return null;
            }

            if (_passwordHasher.VerifyHashedPassword(user, user.Password, password) == PasswordVerificationResult.Success)
            {
                _logger.LogDebug("Success!");
            }
            else
            {
                _logger.LogError("Failed. Wrong username and/or password.");
                return null;
            }

            user.Token = _getToken(user);

            return WithoutPassword(user);
        }

        public Users CreateAccount(Users user)
        {

            Users newUser;

            if (_checkValidity(user.Username))
            {
                newUser = new Users
                {
                    Username = user.Username,
                    Password = _passwordHasher.HashPassword(user, user.Password),
                    Role = user.Role
                };
            } else
            {
                return null;
            }

            try
            {
                this._context.users.Add(newUser);
                this._context.SaveChanges();

            }
            catch (Exception ex)
            {
                _logger.LogError("Uh oh! Caught exception: " + ex.ToString());
                return null;
            }

            return newUser;
        }

        public List<Users> GetAllUsers()
        {
            List<Users> allUsers;

            try
            {
                allUsers = this._context.users.ToList();
            } catch (Exception ex)
            {
                this._logger.LogInformation("Caught exception: " + ex);
                return null;
            }

            return allUsers;
        }

        public Users GetUser(int userID)
        {
            Users user;

            try
            {
                user = this._context.users.Where(user => user.ID == userID).ToList()[0];

            } catch (Exception ex)
            {
                this._logger.LogError("Caught exception: " + ex);
                return null;
            }

            return user;
        }

        public Users ChangePassword(Users user)
        {

            //add error handling
            
            if (GetUser(user.ID) != null)
            {
                string newPassword = this._passwordHasher.HashPassword(user, user.Password);
                user.Password = newPassword;
            } else
            {
                return null;
            }

            this._context.users.Update(user);
            this._context.SaveChanges();
            return user;
        }

        private Users WithoutPassword(Users user)
        {
            user.Password = null;
            return user;
        }

        private string _getToken(Users user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.ID.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        private bool _checkValidity(string username)
        {
            List<Users> allUsers = GetAllUsers();

            foreach (Users user in allUsers)
            {
                if (user.Username == username)
                {
                    return false;
                }
            }

            return true;

        }

    }
}
