using System;
using System.Collections;
using System.Collections.Generic;
using api.Models;

namespace api.Models
{
    public class FullRecipe
    {
        //public string Name { get; set; }
        public int RecipeID { get; set; }
        public string Name { get; set; }
        public string ImagePath { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public float PrepTimeH { get; set; }
        public float PrepTimeM { get; set; }
        public float CookTimeH { get; set; }
        public float CookTimeM { get; set; }
        public List<Ingredient> Ingredients { get; set; }
        public List<Steps> Steps { get; set; }
        public List<SubSteps> SubSteps { get; set; }
        public List<Tips> Tips { get; set; }
        public List<SubTips> SubTips { get; set; }
#nullable enable
        public List<Photo>? AdditionalPhotos { get; set; }
        public string? PrepTime { get; set; }
        public string? CookTime { get; set; }
        public long Created { get; set; }
        public long LastModified { get; set; }

    }
}
