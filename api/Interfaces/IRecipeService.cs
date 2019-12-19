using System.Collections.Generic;
using api.Models;

namespace api.Interfaces
{
    public interface IRecipeService
    {
        FullRecipe GetSingleRecipe(int id);
        List<Ingredient> GetIngredients(int RecipeID);
        List<Steps> GetSteps(int RecipeID);
        List<SubSteps> GetSubSteps(int RecipeID);
        List<Tips> GetTips(int RecipeID);
        List<SubTips> GetSubTips(int RecipeID);
    }
}
