using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using api.Entities;
using api.Models;
using api.Helpers;
using api.Contexts;
using api.Interfaces;

namespace api.Services
{

    public class UserService : IUserService
    {

        private RecipeContext _context;
        private readonly ILogger<UserService> _logger;

        private List<Users> _users = new List<Users>
        {
            new Users { ID = 0, FirstName = "Admin", LastName = "User", Username = "Admin", Password = "admin", Role = Role.Admin },
            new Users { ID = 1, FirstName = "User", LastName = "User", Username = "User", Password = "user", Role = Role.User }
        };

        private readonly AppSettings _appSettings;

        public UserService(IOptions<AppSettings> appSettings, ILogger<UserService> logger, RecipeContext context)
        {
            _appSettings = appSettings.Value;
            _logger = logger;
            _context = context;
        }

        public Users Authenticate(string username, string password)
        {
            var user = _context.users.SingleOrDefault(x => x.Username == username && x.Password == password);

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

            return user;

        }

    }
}
