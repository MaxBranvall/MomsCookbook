
namespace api.Entities
{
    public class AdminRequest
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public int Completed { get; set; }
        public int Granted { get; set; }
    }
}
