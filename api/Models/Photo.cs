using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Photo
    {
        public int ID { get; set; }
        public int RecipeID { get; set; }
        public string ImagePath { get; set; }
    }
}
