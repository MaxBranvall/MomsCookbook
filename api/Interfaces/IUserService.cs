using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Entities;

namespace api.Interfaces
{
    public interface IUserService
    {
        List<Users> GetAllUsers();
        Users GetUser(int userID);
        Users Authenticate(string username, string password);
        Users CreateAccount(Users user);
        Users ChangePassword(Users user);
        bool DeleteUser(int id);
    }
}
