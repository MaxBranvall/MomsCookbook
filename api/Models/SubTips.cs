
namespace api.Models
{
    public class SubTips
    {
        public int ID { get; set; }
        public int RecipeID { get; set; }
        public int LocalTipID { get; set; }
        public string Contents { get; set; }
        public int SubTipID { get; set; }
    }
}
