using System;
using System.Collections.Generic;
using api.Models;

namespace api.Models
{
    public class Recipe
    {
        public string Name { get; set; }
        public Photo Image { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public int PrepTimeH { get; set; }
        public int PrepTimeM { get; set; }
        public int CookTimeH { get; set; }
        public int CookTimeM { get; set; }
        public List<Ingredient> Ingredients { get; set; }
        public List<Step> Steps { get; set; }
        public List<Tip> Tips { get; set; }
#nullable enable
        public List<Photo>? AdditionalPhotos { get; set; }
        public string? PrepTime { get; set; }
        public string? CookTime { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastModified { get; set; }

    }
}
