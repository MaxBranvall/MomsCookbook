using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using api.Entities;
using api.Interfaces;
using api.ExtensionMethods;
using api.Models;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers
{
    //[Authorize]
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

        //TODO: For delete and put maybe return 204 instead of 200 or 201

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
                return Ok(user.WithoutPassword());
            } else
            {
                this._logger.LogError("There was an issue retrieving user with ID: " + ID);
                return NotFound("User not found.");
            }
        }

        //GET: v1/auth/getAllUsers
        //[Authorize(Roles = Role.Admin)]
        [HttpGet("getAllUsers")]
        public ActionResult<List<Users>> GetAll()
        {
            this._logger.LogInformation("Attempting to retrieve all users from database.");

            List<Users> allUsers = this._userService.GetAllUsers();


            if (allUsers != null)
            {
                this._logger.LogInformation("Successfully retrieved list of all users.");
                return Ok(allUsers.RemovePasswords());
            } else
            {
                this._logger.LogError("Can not retrieve list of users");
                return NotFound("Can not retrieve list of users.");
            }

        }

        //POST: v1/auth/authenticateUser
        //[AllowAnonymous]
        [HttpPost("authenticateUser")]
        public ActionResult<Users> AuthenticateUser([FromBody] AuthenticateModel user)
        {

           this._logger.LogInformation("Attempting to authenticate user: " + user.Username);

            Users user1 = this._userService.Authenticate(user.Username, user.Password);

            if (user1 != null)
            {
                this._logger.LogInformation("Succesfully authenticated user: " + user.Username);
                return Ok(user1.WithoutPassword());
            } else
            {
                this._logger.LogError("Can not authenticate user: " + user.Username);
                return Unauthorized("Incorrect username and/or password.");
            }
        }

        //POST: v1/auth/createUser
        //[AllowAnonymous]
        [HttpPost("createUser")]
        public ActionResult<Users> CreateUser(Users user)
        {
            this._logger.LogInformation("Attempting to create user: " + user.Username);

            Users newUser = this._userService.CreateAccount(user);

            
            if (newUser != null)
            {
                this._logger.LogInformation("Successfully created user: " + newUser.Username);
                return CreatedAtAction(nameof(GetUser), new { ID = newUser.ID }, this._userService.GetUser(newUser.ID).WithoutPassword());
            }
            else
            {
                this._logger.LogError("There was an issue creating user: " + user.Username);
                return BadRequest("This username already exists.");
            }

        }

        //PUT: v1/auth/changePassword
        //[AllowAnonymous]
        [HttpPut("changePassword")]
        public ActionResult<Users> ChangePassword(Users user)
        {
            this._logger.LogInformation("Attempting to change password for user: " + user.Username);

            Users userNewPassword = this._userService.ChangePassword(user);

            if (userNewPassword != null)
            {
                this._logger.LogInformation("Successfully changed password for user: " + userNewPassword.Username);
                return CreatedAtAction(nameof(GetUser), new { ID = userNewPassword.ID }, userNewPassword.WithoutPassword());
            } else
            {
                this._logger.LogError("There was an issue changing the password for user: " + user.Username);
                return BadRequest();
            }
        }

        //DELETE: v1/auth/deleteUser/5
        [HttpDelete("deleteUser/{id}")]
        public ActionResult<Users> DeleteUser(int id)
        {
            this._logger.LogInformation("Attempting to delete user with id: " + id);

            bool deleteUser = this._userService.DeleteUser(id);

            if (deleteUser)
            {
                this._logger.LogInformation("Successfully deleted user with id: " + id);
                return NoContent();
            } else
            {
                this._logger.LogError("There was an error deleting user with id: " + id);
                return BadRequest(new { message = "Could not delete user with id: " + id });
            }

        }

    }
}