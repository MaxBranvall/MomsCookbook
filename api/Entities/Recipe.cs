
namespace api.Entities
{
    public class Recipe
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string ImagePath { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string PrepTime { get; set; }
        public string CookTime { get; set; }
        public long Created { get; set; }
        public long LastModified { get; set; }
    }
}
