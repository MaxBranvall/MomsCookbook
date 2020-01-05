using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Contexts
{
    public class RecipeContext : DbContext
    {

        public RecipeContext(DbContextOptions<RecipeContext> options) : base(options)
        {  }

        public DbSet<Recipe> recipe { get; set; }
        public DbSet<Ingredient> ingredients { get; set; }
        public DbSet<Steps> steps { get; set; }
        public DbSet<SubSteps> substeps { get; set; }
        public DbSet<Tips> tips { get; set; }
        public DbSet<SubTips> subtips { get; set; }

    }
}
