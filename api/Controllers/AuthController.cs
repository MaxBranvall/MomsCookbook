using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using api.Entities;
using api.Interfaces;
using System.Runtime.InteropServices.WindowsRuntime;

namespace api.Controllers
{
    [Route("v1/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IUserService _userService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IUserService userService, ILogger<AuthController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        //TODO: add delete user

        // v1/auth/testget
        [HttpGet("testget")]
        public string Test()
        {
            return "Test complete!";
        }

        //GET: v1/auth/getUser/5
        [HttpGet("getUser/{id}")]
        public ActionResult<Users> GetUser(int ID)
        {
            this._logger.LogInformation("Attempting to retrieve user with id: " + ID);

            Users user = this._userService.GetUser(ID);

            if (user != null)
            {
                this._logger.LogInformation($"Successfully retrieved user with ID: {user.ID} and username: {user.Username}");
                return Ok(user);
            } else
            {
                this._logger.LogError("There was an issue retrieving user with ID: " + ID);
                return NotFound("User not found.");
            }
        }

        //GET: v1/auth/getAllUsers
        [HttpGet("getAllUsers")]
        public ActionResult<List<Users>> GetAll()
        {
            this._logger.LogInformation("Attempting to retrieve all users from database.");

            List<Users> allUsers = this._userService.GetAllUsers();

            if (allUsers != null)
            {
                this._logger.LogInformation("Successfully retrieved list of all users.");
                return Ok(allUsers);
            } else
            {
                this._logger.LogError("Can not retrieve list of users");
                return NotFound("Can not retrieve list of users.");
            }

        }

        //POST: v1/auth/authenticateUser
        [HttpPost("authenticateUser")]
        public ActionResult<Users> AuthenticateUser(Users user)
        {

           this._logger.LogInformation("Attempting to authenticate user: " + user.Username);

            Users user1 = this._userService.Authenticate(user.Username, user.Password);

            if (user1 != null)
            {
                this._logger.LogInformation("Succesfully authenticated user: " + user.Username);
                return Ok(user1);
            } else
            {
                this._logger.LogError("Can not authenticate user: " + user.Username);
                return Unauthorized("Incorrect username and/or password.");
            }
        }

        //POST: v1/auth/createUser
        [HttpPost("createUser")]
        public ActionResult<Users> CreateUser(Users user)
        {
            this._logger.LogInformation("Attempting to create user: " + user.Username);

            Users newUser = this._userService.CreateAccount(user);

            
            if (newUser != null)
            {
                this._logger.LogInformation("Successfully created user: " + newUser.Username);
                return Ok(newUser);
            } else
            {
                this._logger.LogError("There was an issue creating user: " + user.Username);
                return BadRequest();
            }

        }

        //PUT: v1/auth/changePassword
        [HttpPut("changePassword")]
        public ActionResult<Users> ChangePassword(Users user)
        {
            this._logger.LogInformation("Attempting to change password for user: " + user.Username);

            Users userNewPassword = this._userService.ChangePassword(user);

            if (userNewPassword != null)
            {
                //fix error here
                this._logger.LogInformation("Successfully changed password for user: " + userNewPassword.Username);
                return CreatedAtAction(nameof(GetUser), userNewPassword);
            } else
            {
                this._logger.LogError("There was an issue changing the password for user: " + user.Username);
                return BadRequest();
            }
        }

    }
}