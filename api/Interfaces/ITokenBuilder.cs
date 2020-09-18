using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Entities;

namespace api.Interfaces
{
    public interface ITokenBuilder
    {
        string GetAuthToken(Users user);
        string GetAccountCreationToken(Users user);
        string GetChangePasswordToken(Users user);
    }
}
