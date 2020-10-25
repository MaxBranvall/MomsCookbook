
namespace api.Entities
{
    public class SubSteps
    {
        public int ID { get; set; }
        public int RecipeID { get; set; }
        public int LocalStepID { get; set; }
        public string Contents { get; set; }
        public int SubStepID { get; set; }
    }
}
