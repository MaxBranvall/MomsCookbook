using System;
using System.IO;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql;
using api.Models;
using api.Controllers;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {

        private IWebHostEnvironment _env;

        public RecipeController(IWebHostEnvironment env)
        {
            _env = env;
        }

        RecipeContext _context = new RecipeContext();

        // GET: api/Recipe
        [HttpGet]
        public IEnumerable<Recipe> Get()
        {
            return _context.recipe.ToList();
        }

        // GET: api/Recipe/5
        [HttpGet("{name}", Name = "Get")]
        public FullRecipe Get(string name)
        {
            List<FullRecipe> list = new List<FullRecipe>();

            return new FullRecipe() { Name = "test" };
        }


       //POST: api/Recipe
       [HttpPost]
        public async Task<int> Post([FromBody] FullRecipe value)
        {

            Recipe r = new Recipe()
            {
                Name = value.Name,
                ImagePath = _env.ContentRootPath,
                Description = value.Description,
                Category = value.Category,
                PrepTime = value.PrepTime,
                CookTime = value.CookTime,
                Created = value.Created,
                LastModified = value.LastModified
            };

            await _context.recipe.AddAsync(r);
            await _context.SaveChangesAsync();

            int id = r.ID;

            AddIngredients(value.Ingredients, id);
            AddSteps(value.Steps, id);
            AddSubSteps(value.SubSteps, id);
            AddTips(value.Tips, id);
            AddSubTips(value.SubTips, id);


            await _context.SaveChangesAsync();

            return r.ID;
        }

        public async void AddIngredients(List<Ingredient> ingredientList, int recipeID)
        {
            foreach (Ingredient i in ingredientList)
            {
                Ingredient y = new Ingredient()
                {
                    RecipeID = recipeID,
                    LocalIngredientID = i.LocalIngredientID,
                    Content = i.Content,
                    Quantity = i.Quantity,
                    Unit = i.Unit
                };

                await _context.ingredients.AddAsync(y);

            }
        }

        private async void AddSteps(List<Steps> stepList, int recipeID)
        {
            foreach (Steps s in stepList)
            {
                Steps step = new Steps()
                {
                    RecipeID = recipeID,
                    LocalStepID = s.LocalStepID,
                    Content = s.Content
                };

                await _context.steps.AddAsync(step);

            }
        }

        private async void AddSubSteps(List<SubSteps> subStepList, int recipeID)
        {

            foreach (SubSteps step in subStepList)
            {

                SubSteps s = new SubSteps()
                {
                    RecipeID = recipeID,
                    LocalStepID = step.LocalStepID,
                    Content = step.Content,
                    SubStepID = step.SubStepID
                };

                await _context.substeps.AddAsync(s);
            }

        }

        private async void AddTips(List<Tips> tipList, int recipeID)
        {
            foreach (Tips tip in tipList)
            {
                Tips t = new Tips()
                {
                    RecipeID = recipeID,
                    LocalTipID = tip.LocalTipID,
                    Content = tip.Content,
                };

                await _context.tips.AddAsync(t);
            }
        }

        private async void AddSubTips(List<SubTips> subTipList, int recipeID)
        {
            foreach (SubTips tip in subTipList)
            {
                SubTips t = new SubTips()
                {
                    RecipeID = recipeID,
                    LocalTipID = tip.LocalTipID,
                    Content = tip.Content,
                    SubTipID = (int)tip.SubTipID
                };

                await _context.subtips.AddAsync(t);
            }
        }

        //// PUT: api/Recipe/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE: api/ApiWithActions/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
