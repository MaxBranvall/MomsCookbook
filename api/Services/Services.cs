using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api
{
    public class Services
    {

        private RecipeContext _context;

        public Services(RecipeContext recipeContext)
        {
            _context = recipeContext;
        }

        public FullRecipe getSingleRecipe(int id)
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

            recipe.Ingredients = getIngredients(recipe.RecipeID);
            recipe.Steps = getSteps(recipe.RecipeID);
            recipe.SubSteps = getSubSteps(recipe.RecipeID);
            recipe.Tips = getTips(recipe.RecipeID);
            recipe.SubTips = getSubTips(recipe.RecipeID);

            return recipe;

        }

        private List<Ingredient> getIngredients(int RecipeID)
        {
            List<Ingredient> ingredients = _context.ingredients.Where(x => x.RecipeID == RecipeID).ToList();
            return ingredients;
        }

        private List<Steps> getSteps(int RecipeID)
        {
            List<Steps> steps = _context.steps.Where(x => x.RecipeID == RecipeID).ToList();
            return steps;
        }

        private List<SubSteps> getSubSteps(int RecipeID)
        {
            List<SubSteps> subSteps = _context.substeps.Where(x => x.RecipeID == RecipeID).ToList();
            return subSteps;
        }

        private List<Tips> getTips(int RecipeID)
        {
            List<Tips> tips = _context.tips.Where(x => x.RecipeID == RecipeID).ToList();
            return tips;
        }

        private List<SubTips> getSubTips(int RecipeID)
        {
            List<SubTips> subTips = _context.subtips.Where(x => x.RecipeID == RecipeID).ToList();
            return subTips;
        }

    }
}
