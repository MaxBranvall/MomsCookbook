using System;
using Microsoft.AspNetCore.Http;

namespace api.Models
{
    public class Photo
    {
        public int RecipeID { get; set; }
        public IFormFile File { get; set; }
        public string Name { get; set; }
    }
}
