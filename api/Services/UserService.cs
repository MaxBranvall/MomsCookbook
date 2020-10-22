using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Entities;
using api.Models;
using api.Helpers;
using api.Contexts;
using api.Interfaces;
using api.ExtensionMethods;
using EmailHelper;

namespace api.Services
{

    public class UserService : IUserService
    {

        private PasswordHasher<Users> _passwordHasher;
        private RecipeContext _context;
        private ITokenBuilder _tokenBuilder;
        private readonly AppSettings _appSettings;
        private readonly JWT_Settings _jwtSettings;
        private readonly EmailSettings _emailSettings;
        private readonly URLs _urls;
        private readonly ILogger<UserService> _logger;
        private readonly string env;
        private string url;
        private Mail _emailService;

        public UserService(IOptions<AppSettings> appSettings, IOptions<JWT_Settings> jwtSettings,
                            ILogger<UserService> logger, IOptions<URLs> urls, IOptions<EmailSettings> emailSettings,
                            RecipeContext context, ITokenBuilder tokenBuilder)
        {
            _jwtSettings = jwtSettings.Value;
            _appSettings = appSettings.Value;
            _emailSettings = emailSettings.Value;
            _urls = urls.Value;
            _logger = logger;
            _context = context;
            _tokenBuilder = tokenBuilder;
            _passwordHasher = new PasswordHasher<Users>();
            _emailService = new Mail(this._emailSettings.NameOfSender, this._emailSettings.Sender, this._emailSettings.SenderPassword, this._emailSettings.Host, this._emailSettings.Port);

            env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            if (env == "Development")
            {
                url = this._urls.Development;
            } else if (env == "Staging")
            {
                url = this._urls.Staging;
            } else if (env == "Production")
            {
                url = this._urls.Production;
            }

        }

        public string GetChangePasswordToken(string email)
        {

            //Email token to user

            Users user;

            if (!_checkValidEmail(email))
            {

                try
                {

                    user = this._context.users.Where(user => user.EmailAddress == email).ToList()[0];
                    string userFullName = user.FirstName + " " + user.LastName;
                    this._emailService.ComposeEmail(userFullName, user.EmailAddress, "Forgot Password", "Click here to reset password: " + this.url + "/forgotPassword/" + user.ID + "?token=" + this._tokenBuilder.GetChangePasswordToken(user));
                    this._emailService.SendMessage();

                    return this._tokenBuilder.GetChangePasswordToken(user);

                } catch (Exception ex)
                {
                    this._logger.LogError("Caught exception: " + ex);

                    return null;
                }
            }

            return null;
        }

        public Users Authenticate(string emailAddress, string password)
        {
            var user = _context.users.SingleOrDefault(x => x.EmailAddress == emailAddress);

            if (user == null)
            {
                return null;
            }

            try
            {
                if (_passwordHasher.VerifyHashedPassword(user, user.Password, password) == PasswordVerificationResult.Success)
                {
                    _logger.LogInformation("Correct password! Generating token.");
                    user.Token = _tokenBuilder.GetAuthToken(user);
                    return user;
                }
                else
                {
                    _logger.LogError("Failed. Wrong email address and/or password.");
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

            if (_checkValidEmail(user.EmailAddress))
            {
                newUser = new Users
                {
                    EmailAddress = user.EmailAddress,
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

                String token = _tokenBuilder.GetAccountCreationToken(newUser);
                newUser.Token = token;

                string userFullName = newUser.FirstName + " " + newUser.LastName;
                this._emailService.ComposeEmail(userFullName, newUser.EmailAddress, "New Account", "Your account was created. Link: " + this.url + "/verifyEmail/" + newUser.ID + "?token=" + token);
                this._emailService.SendMessage();

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

            existingUser.Token = this._tokenBuilder.GetAuthToken(existingUser);
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

        public Users VerifyUser(Users user)
        {

            user.Verified = true;

            try
            {
                this._context.users.Attach(user);
                this._context.Entry(user).State = EntityState.Modified;
                this._context.Entry(user).Property(x => x.Verified).IsModified = true;
                this._context.SaveChanges();
            } catch (Exception ex)
            {
                this._logger.LogError("Caught exception: " + ex.ToString());
                return null;
            }

            user.Token = this._tokenBuilder.GetAuthToken(user);

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

        private bool _checkValidEmail(string email)
        {

            List<Users> allUsers = GetAllUsers();

            foreach (Users user in allUsers)
            {
                if (user.EmailAddress == email)
                {
                    return false;
                }
            }

            return true;

        }

    }
}
