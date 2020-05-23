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
using Microsoft.AspNetCore.Mvc;
using api.Entities;
using api.Models;
using api.Helpers;
using api.Contexts;
using api.Interfaces;
using api.ExtensionMethods;
using Microsoft.EntityFrameworkCore;

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

            try
            {
                if (_passwordHasher.VerifyHashedPassword(user, user.Password, password) == PasswordVerificationResult.Success)
                {
                    _logger.LogInformation("Correct password! Generating token.");
                    user.Token = _getToken(user);
                    return user;
                }
                else
                {
                    _logger.LogError("Failed. Wrong username and/or password.");
                    return null;
                }
            } catch (Exception ex)
            {
                this._logger.LogInformation("Caught exception ex: " + ex);
                return null;
            }
        }

        public Users CreateAccount(Users user)
        {

            Users newUser;

            if (_checkValidity(user.Username))
            {
                newUser = new Users
                {
                    Username = user.Username,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role
                };

                newUser.Password = this._passwordHasher.HashPassword(newUser, user.Password);

            } else
            {
                return null;
            }

            try
            {
                this._context.users.Add(newUser);
                this._context.SaveChanges();

                if (newUser.Role == Role.Admin)
                {
                    this._logger.LogInformation("Attempting to create admin request..");
                    newUser.Role = Role.User;
                    this._context.users.Update(newUser);

                    if (!this._createAdminRequest(newUser.ID))
                    {
                        this._logger.LogError("There was an issue making the admin request.");
                        return null;
                    }
                    this._logger.LogInformation("Admin request created!");
                    this._context.SaveChanges();
                }

                return newUser;

            }
            catch (Exception ex)
            {
                _logger.LogError("Uh oh! Caught exception: " + ex.ToString());
                return null;
            }
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

            Users existingUser = GetUser(user.ID);

            if (existingUser != null)
            {
                string newPassword = this._passwordHasher.HashPassword(existingUser, user.Password);
                existingUser.Password = newPassword;
            }
            else
            {
                return null;
            }

            this._context.users.Attach(existingUser);
            this._context.Entry(existingUser).Property(x => x.Password).IsModified = true;
            this._context.SaveChanges();
            return existingUser;
        }

        public Users UpdateUser(Users user)
        {
            try
            {
                this._context.users.Attach(user);
                this._context.Entry(user).State = EntityState.Modified;
                this._context.Entry(user).Property(x => x.Password).IsModified = false;
                this._context.SaveChanges();
            } catch (Exception ex)
            {
                this._logger.LogError("Caught Exception: " + ex.ToString());
                return null;
            }

            return user;
        }

        public bool DeleteUser(int id)
        {
            Users user = GetUser(id);

            try
            {
                if (user != null)
                {
                    this._context.users.Remove(user);
                    this._context.SaveChanges();
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                this._logger.LogError("Caught exception: " + ex);
                return false;
            }
        }

        private bool _createAdminRequest(int userID)
        {

            try
            {
                this._context.adminrequest.Add(new AdminRequest() { UserID = userID });
            } catch (Exception ex)
            {
                this._logger.LogError("Caught Exception: " + ex.ToString());
                return false;
            }

            return true;
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
                    new Claim(ClaimTypes.NameIdentifier, user.LastName),
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

            //maybe move to extension method

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
