using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using api.Models;
using api.Interfaces;
using Serilog;
using Microsoft.AspNetCore.Http;

namespace api.Controllers
{

    [EnableCors("AllowCors")]
    [Route("v1/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {

        private readonly IRecipeService _recipeService;
        private readonly ILogger<RecipesController> _logger;

        public RecipesController(IRecipeService recipeService, ILogger<RecipesController> logger)
        {
            _logger = logger;
            _recipeService = recipeService;
        }

        //GET: api/Recipes/test
        [HttpGet("test")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult TestGet()
        {
            _logger.LogInformation("TestGet method called");
            return Ok();
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
        public ActionResult<IEnumerable<FullRecipe>> GetCategory(string category)
        {
            _logger.LogInformation("Get category called");
            return Ok(this._recipeService.GetAllRecipesByCategory(category));
        }

        // GET: api/Recipes/5
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

        //Post: api/Recipes
        [HttpPost]
        public ActionResult<FullRecipe> PostFullRecipe(FullRecipe fullRecipe)
        {
            _logger.LogInformation("Post recipe called");
            FullRecipe r = this._recipeService.PostRecipe(fullRecipe);
            return CreatedAtAction(nameof(GetRecipe), new { id = r.RecipeID }, r);
        }

        // PUT: api/Recipes
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

        // PUT: api/Recipes/updateRecipe
        [HttpPut("updateRecipe")]
        public async Task<StatusCodeResult> UpdateRecipe(FullRecipe recipe)
        {
            _logger.LogInformation("request made");
            try
            {
                _recipeService.UpdateRecipe(recipe);
            } catch (Exception ex)
            {
                _logger.LogInformation("Error: " + ex);
            }
            return Ok();
        }

        //    //// DELETE: api/Recipes/5
        //    //[HttpDelete("{id}")]
        //    //public void Delete(int id)
        //    //{
        //    //}
    }
}
