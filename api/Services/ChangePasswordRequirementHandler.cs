using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using api.Interfaces;

namespace api.Services
{
    public class ChangePasswordRequirementHandler : AuthorizationHandler<ChangePasswordRequirement>
    {

        IUserService _userService;

        public ChangePasswordRequirementHandler(IUserService userService)
        {
            _userService = userService;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ChangePasswordRequirement requirement)
        {

            if (context.User.HasClaim(c => c.Type == "Password"))
            {
                string password = context.User.FindFirst("Password").Value;
                if (password == this._userService.GetUser(Int32.Parse(context.User.FindFirst(ClaimTypes.Name).Value)).Password)
                {
                    context.Succeed(requirement);
                    return Task.CompletedTask;
                }
                return Task.CompletedTask;
            }
            return Task.CompletedTask;
        }
    }
}
