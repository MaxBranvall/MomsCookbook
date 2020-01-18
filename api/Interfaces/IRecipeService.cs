using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using api.Models;

namespace api.Interfaces
{
    public interface IRecipeService
    {
        List<FullRecipe> GetAllRecipes();
        List<FullRecipe> GetAllRecipesByCategory(string category);
        ActionResult<FullRecipe> GetSingleRecipe(int id);
        List<Ingredient> GetIngredients(int RecipeID);
        List<Steps> GetSteps(int RecipeID);
        List<SubSteps> GetSubSteps(int RecipeID);
        List<Tips> GetTips(int RecipeID);
        List<SubTips> GetSubTips(int RecipeID);
        FullRecipe PostRecipe(FullRecipe recipe);
        Task<StatusCodeResult> AddDownloadURL(Recipe r);
    }
}
