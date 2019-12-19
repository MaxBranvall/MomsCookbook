using System;
using System.Collections.Generic;
using System.Linq;
using api.Interfaces;
using api.Models;

namespace api.Services
{
    public class RecipeService : IRecipeService
    {

        private RecipeContext _context;

        public RecipeService(RecipeContext recipeContext)
        {
            _context = recipeContext;
        }

        public FullRecipe GetSingleRecipe(int id)
        {

            Recipe r = _context.recipe.Where(x => x.ID == id).ToList()[0];

            FullRecipe recipe = new FullRecipe()
            {
                RecipeID = r.ID,
                Name = r.Name,
                ImagePath = r.ImagePath,
                Description = r.Description,
                Category = r.Category,
                PrepTime = r.PrepTime,
                CookTime = r.CookTime,
                Created = r.Created,
                LastModified = r.LastModified
            };

            String[] prepTimeSplit = recipe.PrepTime.Split(":");
            String[] cookTimeSplit = recipe.CookTime.Split(":");

            recipe.PrepTimeH = int.Parse(prepTimeSplit[0]);
            recipe.PrepTimeM = int.Parse(prepTimeSplit[1]);
            recipe.CookTimeH = int.Parse(cookTimeSplit[0]);
            recipe.CookTimeM = int.Parse(cookTimeSplit[1]);

            recipe.Ingredients = GetIngredients(recipe.RecipeID);
            recipe.Steps = GetSteps(recipe.RecipeID);
            recipe.SubSteps = GetSubSteps(recipe.RecipeID);
            recipe.Tips = GetTips(recipe.RecipeID);
            recipe.SubTips = GetSubTips(recipe.RecipeID);

            return recipe;

        }

        public List<Ingredient> GetIngredients(int RecipeID)
        {
            List<Ingredient> ingredients = _context.ingredients.Where(x => x.RecipeID == RecipeID).ToList();
            return ingredients;
        }

        public List<Steps> GetSteps(int RecipeID)
        {
            List<Steps> steps = _context.steps.Where(x => x.RecipeID == RecipeID).ToList();
            return steps;
        }

        public List<SubSteps> GetSubSteps(int RecipeID)
        {
            List<SubSteps> subSteps = _context.substeps.Where(x => x.RecipeID == RecipeID).ToList();
            return subSteps;
        }

        public List<Tips> GetTips(int RecipeID)
        {
            List<Tips> tips = _context.tips.Where(x => x.RecipeID == RecipeID).ToList();
            return tips;
        }

        public List<SubTips> GetSubTips(int RecipeID)
        {
            List<SubTips> subTips = _context.subtips.Where(x => x.RecipeID == RecipeID).ToList();
            return subTips;
        }

    }
}
