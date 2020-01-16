using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using api.Models;
using api.Interfaces;

namespace api.Controllers
{

    [EnableCors("AllowCors")]
    [Route("v1/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {

        private readonly IRecipeService _recipeService;

        public RecipesController(IRecipeService recipeService)
        {
            _recipeService = recipeService;
        }

        //GET: api/Recipes/test
        [HttpGet("test")]
        public string TestGet()
        {
            return "success";
        }

        //POST: api/recipes/testpost
        [HttpPost("testpost")]
        public string TestPost(string s)
        {
            return "success post: " + s;
        }

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

        //    //// DELETE: api/Recipes/5
        //    //[HttpDelete("{id}")]
        //    //public void Delete(int id)
        //    //{
        //    //}
    }
}
