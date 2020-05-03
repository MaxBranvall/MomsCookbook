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
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(ClaimTypes.Name, user.LastName)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

    }
}
