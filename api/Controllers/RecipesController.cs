using System;
using System.IO;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Controllers;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {

        private RecipeContext _context;

        public RecipesController(RecipeContext recipeContext)
        {
            _context = recipeContext;
        }

        // GET: api/Recipe
        [HttpGet]
        public IEnumerable<Recipe> Get()
        {
            return _context.recipe.ToList();
        }

        // GET: api/Recipe/5
        [HttpGet("{ID}", Name = "Get")]
        //[HttpGet]
        public FullRecipe Get(int ID)
        {
            Console.WriteLine(ID.ToString());
            FullRecipe recipe = new FullRecipe();

            IQueryable<Recipe> recipeFromDB = _context.recipe.Where(x => x.ID == ID);

            foreach(Recipe x in recipeFromDB)
            {
                recipe.RecipeID = x.ID;
                recipe.Name = x.Name;
                recipe.ImagePath = x.ImagePath;
                recipe.Description = x.Description;
                recipe.Category = x.Category;
                recipe.PrepTime = x.PrepTime;
                recipe.CookTime = x.CookTime;

                recipe.Created = x.Created;
                recipe.LastModified = x.LastModified;
                recipe.Ingredients = new List<Ingredient>();
                recipe.Steps = new List<Steps>();
                recipe.SubSteps = new List<SubSteps>();
                recipe.Tips = new List<Tips>();
                recipe.SubTips = new List<SubTips>();
            }

            IQueryable<Ingredient> ingredientsFromDB = _context.ingredients.Where(x => x.RecipeID == recipe.RecipeID);
            IQueryable<Steps> stepsFromDB = _context.steps.Where(x => x.RecipeID == recipe.RecipeID);
            IQueryable<SubSteps> subStepsFromDB = _context.substeps.Where(x => x.RecipeID == recipe.RecipeID);
            IQueryable<Tips> tipsFromDB = _context.tips.Where(x => x.RecipeID == recipe.RecipeID);
            IQueryable<SubTips> subTipsFromDB = _context.subtips.Where(x => x.RecipeID == recipe.RecipeID);

            foreach(Ingredient i in ingredientsFromDB)
            {
                recipe.Ingredients.Add(i);
            }

            foreach(Steps s in stepsFromDB)
            {
                recipe.Steps.Add(s);
            }

            foreach(SubSteps s in subStepsFromDB)
            {
                recipe.SubSteps.Add(s);
            }

            foreach(Tips t in tipsFromDB)
            {
                recipe.Tips.Add(t);
            }

            foreach(SubTips t in subTipsFromDB)
            {
                recipe.SubTips.Add(t);
            }

            return recipe;
        }

        //POST: api/Recipe
        [HttpPost]
        public async Task<int> Post([FromBody] FullRecipe value)
        {

            Recipe r = new Recipe()
            {
                Name = value.Name,
                ImagePath = null,
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

            return id;
        }

        // PUT: api/Recipe/5
        [HttpPut]
        public async Task<StatusCodeResult> Put(FirebaseURL url)
        {

            Recipe r = new Recipe()
            {
                ID = url.id,
                ImagePath = url.downloadURL
            };

            Console.WriteLine(r.ID + " " + r.ImagePath);

            _context.recipe.Attach(r);
            _context.Entry(r).Property(x => x.ImagePath).IsModified = true;
            var response = await _context.SaveChangesAsync();
            return StatusCode(200);
        }

        //// DELETE: api/ApiWithActions/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}

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

    }
}
