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
        FullRecipe PostRecipe(FullRecipe recipe);
        Task<StatusCodeResult> AddDownloadURL(Recipe r);
        FullRecipe UpdateRecipe(FullRecipe recipe);
        StatusCodeResult DeleteRecipe(int recipeID);
    }
}
