
namespace api.Models
{
    public class Steps
    {
        public int ID { get; set; }
        public int RecipeID { get; set; }
        public int LocalStepID { get; set; }
        public string Content { get; set; }
        public int SubStepID { get; set; }
    }
}
