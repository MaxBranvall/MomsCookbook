
namespace api.Models
{
    public class Ingredient
    {
        public int ID { get; set; }
        public int RecipeID { get; set; }
        public int LocalIngredientID { get; set; }
        public string Contents { get; set; }
        public float Quantity { get; set; }
        public string Unit { get; set; }
    }
}
