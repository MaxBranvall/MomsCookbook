
namespace api.Entities
{
    public class Users
    {
        public int ID { get; set; }
        public string Username { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
        public bool Verified { get; set; }
    }
}
