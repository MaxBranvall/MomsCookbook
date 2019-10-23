using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Ingredient
    {
        public int RecipeID { get; set; }
        public int LocalIngredientID { get; set; }
        public string Content { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }
    }
}
