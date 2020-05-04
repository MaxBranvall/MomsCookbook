using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Serilog;
using api.Models;
using api.Entities;
using api.Interfaces;
using api.Services;

namespace api.Controllers
{

    //[EnableCors("AllowCors")]
    [Route("v1/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {

        //Refactor controller to match AuthController. This code is terrible.

        private readonly IUserService _userService;
        private readonly IRecipeService _recipeService;
        private readonly ILogger<RecipesController> _logger;

        public RecipesController(IRecipeService recipeService, IUserService userService, ILogger<RecipesController> logger)
        {
            _logger = logger;
            _recipeService = recipeService;
            _userService = userService;
        }

        //GET: v1/Recipes
        [HttpGet]
        public IEnumerable<FullRecipe> Get()
        {
            _logger.LogInformation("get called");
            return this._recipeService.GetAllRecipes();
        }

        //GET: v1/Recipes/categories/Dinner
        [HttpGet("categories/{category}")]
        public ActionResult<IEnumerable<FullRecipe>> GetCategory(string category)
        {
            _logger.LogInformation("Get category called");
            return Ok(this._recipeService.GetAllRecipesByCategory(category));
        }

        // GET: v1/Recipes/5
        [HttpGet("{id}")]
        public ActionResult<FullRecipe> GetRecipe(int ID)
        {
            _logger.LogInformation("Get single recipe called");

            var fullRecipe = this._recipeService.GetSingleRecipe(ID);

            if (fullRecipe.Result == NotFound())
            {
                _logger.LogError("error!!");
            }

            return Ok(this._recipeService.GetSingleRecipe(ID).Value);
        }

        //Post: v1/Recipes
        [HttpPost]
        public ActionResult<FullRecipe> PostFullRecipe(FullRecipe fullRecipe)
        {
            _logger.LogInformation("Post recipe called");
            FullRecipe r = this._recipeService.PostRecipe(fullRecipe);
            return CreatedAtAction(nameof(GetRecipe), new { id = r.RecipeID }, r);
        }

        // PUT: v1/Recipes
        [HttpPut]
        public async Task<StatusCodeResult> Put(FirebaseURL url)
        {
            _logger.LogInformation("Post firebase URL called");
            Recipe r = new Recipe()
            {
                ID = url.id,
                ImagePath = url.downloadURL
            };

            return await this._recipeService.AddDownloadURL(r);
        }

        // PUT: v1/Recipes/updateRecipe
        [HttpPut("updateRecipe")]
        public ActionResult<FullRecipe> UpdateRecipe(FullRecipe recipe)
        {

            FullRecipe r;
            _logger.LogInformation("request made");
            r = _recipeService.UpdateRecipe(recipe);

            return CreatedAtAction(nameof(GetRecipe), new { id = recipe.RecipeID }, r);
        }

        // DELETE: v1/Recipes/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            _recipeService.DeleteRecipe(id);
        }
    }
}
