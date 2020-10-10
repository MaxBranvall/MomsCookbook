
namespace api.Entities
{
    public class Tips
    {
        public int ID { get; set; }
        public int RecipeID { get; set; }
        public int LocalTipID { get; set; }
        public string Contents { get; set; }
        public int SubTipID { get; set; }
    }
}
