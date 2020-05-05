using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Entities;

namespace api.ExtensionMethods
{
    public static class UsersExtensions
    {

        public static List<Users> RemovePasswords(this List<Users> allUsers)
        {
            return allUsers.Select(user => user.WithoutPassword()).ToList();
        }

        public static Users WithoutPassword(this Users user)
        {
            user.Password = null;
            return user;
        }
    }
}
