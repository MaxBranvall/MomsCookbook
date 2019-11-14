using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql;
using api.Models;
using Microsoft.Extensions.Configuration;
using System.Collections;
using System;
using System.Configuration;

namespace api.Models
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
