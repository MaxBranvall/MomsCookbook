using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Interfaces;

namespace api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {

        private readonly IRecipeService _recipeService;

        public RecipesController(IRecipeService recipeService)
        {
            _recipeService = recipeService;
        }

        //[HttpGet]
        //public string Get()
        //{
        //    return "success";
        //}

        //GET: api/Recipes
        [HttpGet]
        public IEnumerable<FullRecipe> Get()
        {
            return this._recipeService.GetAllRecipes();
        }

        //GET: api/Recipes/categories/Dinner
        [HttpGet("categories/{category}")]
        public IEnumerable<FullRecipe> GetCategory(string category)
        {
            return this._recipeService.GetAllRecipesByCategory(category);
        }

        // GET: api/Recipes/5
        [HttpGet("{id}")]
        public FullRecipe GetRecipe(int ID)
        {
            return this._recipeService.GetSingleRecipe(ID);
        }

        //Post: api/Recipes
        [HttpPost]
        public ActionResult<FullRecipe> PostFullRecipe(FullRecipe fullRecipe)
        {
            FullRecipe r = this._recipeService.PostRecipe(fullRecipe);
            return CreatedAtAction(nameof(GetRecipe), new { id = r.RecipeID }, r);
        }

        // PUT: api/Recipes/FirebaseURL
        [HttpPut]
        public async Task<StatusCodeResult> Put(FirebaseURL url)
        {
            Recipe r = new Recipe()
            {
                ID = url.id,
                ImagePath = url.downloadURL
            };

            return await this._recipeService.AddDownloadURL(r);

        }

        //POST: api/Recipes
        //    [HttpPost]
        //    public async Task<int> Post([FromBody] FullRecipe value)
        //    {

        //        Recipe r = new Recipe()
        //        {
        //            Name = value.Name,
        //            ImagePath = null,
        //            Description = value.Description,
        //            Category = value.Category,
        //            PrepTime = value.PrepTime,
        //            CookTime = value.CookTime,
        //            Created = value.Created,
        //            LastModified = value.LastModified
        //        };

        //        await _context.recipe.AddAsync(r);
        //        await _context.SaveChangesAsync();

        //        int id = r.ID;

        //        AddIngredients(value.Ingredients, id);
        //        AddSteps(value.Steps, id);
        //        AddSubSteps(value.SubSteps, id);
        //        AddTips(value.Tips, id);
        //        AddSubTips(value.SubTips, id);

        //        await _context.SaveChangesAsync();

        //        return id;
        //    }

        //    //// DELETE: api/Recipes/5
        //    //[HttpDelete("{id}")]
        //    //public void Delete(int id)
        //    //{
        //    //}

        //    public async void AddIngredients(List<Ingredient> ingredientList, int recipeID)
        //    {
        //        foreach (Ingredient i in ingredientList)
        //        {
        //            Ingredient y = new Ingredient()
        //            {
        //                RecipeID = recipeID,
        //                LocalIngredientID = i.LocalIngredientID,
        //                Content = i.Content,
        //                Quantity = i.Quantity,
        //                Unit = i.Unit
        //            };

        //            await _context.ingredients.AddAsync(y);

        //        }
        //    }

        //    private async void AddSteps(List<Steps> stepList, int recipeID)
        //    {
        //        foreach (Steps s in stepList)
        //        {
        //            Steps step = new Steps()
        //            {
        //                RecipeID = recipeID,
        //                LocalStepID = s.LocalStepID,
        //                Content = s.Content
        //            };

        //            await _context.steps.AddAsync(step);

        //        }
        //    }

        //    private async void AddSubSteps(List<SubSteps> subStepList, int recipeID)
        //    {

        //        foreach (SubSteps step in subStepList)
        //        {

        //            SubSteps s = new SubSteps()
        //            {
        //                RecipeID = recipeID,
        //                LocalStepID = step.LocalStepID,
        //                Content = step.Content,
        //                SubStepID = step.SubStepID
        //            };

        //            await _context.substeps.AddAsync(s);
        //        }

        //    }

        //    private async void AddTips(List<Tips> tipList, int recipeID)
        //    {
        //        foreach (Tips tip in tipList)
        //        {
        //            Tips t = new Tips()
        //            {
        //                RecipeID = recipeID,
        //                LocalTipID = tip.LocalTipID,
        //                Content = tip.Content,
        //            };

        //            await _context.tips.AddAsync(t);
        //        }
        //    }

        //    private async void AddSubTips(List<SubTips> subTipList, int recipeID)
        //    {
        //        foreach (SubTips tip in subTipList)
        //        {
        //            SubTips t = new SubTips()
        //            {
        //                RecipeID = recipeID,
        //                LocalTipID = tip.LocalTipID,
        //                Content = tip.Content,
        //                SubTipID = (int)tip.SubTipID
        //            };

        //            await _context.subtips.AddAsync(t);
        //        }
        //    }

        //}
    }
}
