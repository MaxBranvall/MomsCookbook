using Microsoft.EntityFrameworkCore;
using api.Entities;

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
        public DbSet<Users> users { get; set; }
        public DbSet<AdminRequest> adminrequest { get; set; }

    }
}
