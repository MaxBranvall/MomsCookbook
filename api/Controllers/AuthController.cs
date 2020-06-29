﻿using System;
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
    [Authorize]
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

        //GET: v1/auth/5
        [HttpGet("{id}")]
        public ActionResult<Users> GetUser(int id)
        {
            this._logger.LogInformation("Attempting to retrieve user with id: " + id);

            this._logger.LogInformation("Checking permissions..");

            int currentUserID = int.Parse(User.Identity.Name);
            if (id != currentUserID  && !User.IsInRole(Role.Admin))
            {
                this._logger.LogError("Insufficient permissions.");
                return Forbid();
            }

            Users user = this._userService.GetUser(id);

            if (user != null)
            {
                this._logger.LogInformation($"Successfully retrieved user with ID: {user.ID} and username: {user.Username}");
                return Ok(user.WithoutPassword());
            } else
            {
                this._logger.LogError("There was an issue retrieving user with ID: " + id);
                return NotFound("User not found.");
            }
        }

        //GET: v1/auth
        [Authorize(Roles = Role.Admin)]
        [HttpGet]
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

        //POST: v1/auth
        [AllowAnonymous]
        [HttpPost]
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
                return BadRequest("This username or email address already exists.");
            }

        }

        //PUT: v1/auth/5
        [HttpPut("{id}")]
        public ActionResult<Users> updateUser(Users user)
        {
            this._logger.LogInformation("Attempting to update user with id: " + user.ID);
            Users updatedUser = this._userService.UpdateUser(user);

            if (updatedUser != null)
            {
                this._logger.LogInformation("Successfully updated user with ID: " + updatedUser.ID);
                return CreatedAtAction(nameof(GetUser), new { ID = updatedUser.ID }, updatedUser.WithoutPassword());
            }
            else
            {
                this._logger.LogError("There was an issue updated user with ID: " + user.ID);
                return BadRequest();
            }
        }

        //DELETE: v1/auth/5
        [HttpDelete("{id}")]
        public ActionResult<Users> DeleteUser(int id)
        {
            this._logger.LogInformation("Attempting to delete user with id: " + id);

            bool deleteUser = this._userService.DeleteUser(id);

            if (deleteUser)
            {
                this._logger.LogInformation("Successfully deleted user with id: " + id);
                return NoContent();
            }
            else
            {
                this._logger.LogError("There was an error deleting user with id: " + id);
                return BadRequest(new { message = "Could not delete user with id: " + id });
            }

        }

        //POST: v1/auth/authenticateUser
        [AllowAnonymous]
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

        //PUT: v1/auth/changePassword
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

    }
}