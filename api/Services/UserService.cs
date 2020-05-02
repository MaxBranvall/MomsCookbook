using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Threading.Tasks;
using api.Entities;
using api.Models;
using api.Helpers;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

namespace api.Services
{

    public interface IUserService
    {
        string Authenticate(string username, string password);
    }

    public class UserService : IUserService
    {

        private readonly ILogger<UserService> _logger;

        private List<User> _users = new List<User>
        {
            new User { ID = 0, FirstName = "Admin", LastName = "User", Username = "Admin", Password = "admin", Role = Role.Admin },
            new User { ID = 1, FirstName = "User", LastName = "User", Username = "User", Password = "user", Role = Role.User }
        };

        private readonly AppSettings _appSettings;

        public UserService(IOptions<AppSettings> appSettings, ILogger<UserService> logger)
        {
            _appSettings = appSettings.Value;
            _logger = logger;
        }

        public string Authenticate(string username, string password)
        {
            var user = _users.SingleOrDefault(x => x.Username == username && x.Password == password);

            _logger.LogInformation(user.LastName);

            if (user == null)
            {
                return null;
            }

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
            user.Token = tokenHandler.WriteToken(token);

            return user.Token;

        }

    }
}
