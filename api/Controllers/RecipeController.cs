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
        public IEnumerable<FullRecipe> Get()
        {
            List<FullRecipe> list = new List<FullRecipe>();

            return list;
        }

        // GET: api/Recipe/5
        [HttpGet("{name}", Name = "Get")]
        public FullRecipe Get(string name)
        {
            List<FullRecipe> list = new List<FullRecipe>();

            return new FullRecipe() { Name = "test" };
        }

        ////POST: api/UploadImage
        //[HttpPost]
        //public 

        //POST: api/Recipe
       [HttpPost]
        public async Task<Recipe> Post([FromBody] FullRecipe value)
        //public void Post(IFormFile filesData)
        {
            //var filePath = _env.ContentRootPath + "newImage.jpeg";


            //using (var stream = new FileStream(filePath, FileMode.Create))
            //{
            //    filesData.CopyTo(stream);
            //}

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
            //await _context.SaveChangesAsync();

            AddIngredients(value.Ingredients);
            AddSteps(value.Steps);
            AddSubSteps(value.SubSteps);
            AddTips(value.Tips);
            AddSubTips(value.SubTips);
            //UploadImage(value.Image.File, value.RecipeID);

            await _context.SaveChangesAsync();

            return r;
        }

        [HttpPost("Uploadimage")]
        //[Route("UploadImage")]
        public async Task<Photo> UploadImage(Photo photo)
        {

            Photo p = new Photo()
            {
                RecipeID = photo.RecipeID,
                File = photo.File,
                Name = photo.Name,
            };

            // filename = recipeid_year/month/day_hh:mm:ss_name.ext

            string dt = DateTime.Now.ToString("yyyy/mm/dd_hh:mm:ss");
            string fileName = string.Format("{0}_{1}_{2}", p.RecipeID, dt, p.File.FileName);
            string filePath = _env.ContentRootPath + "/uploads/" + fileName;

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await p.File.CopyToAsync(stream);
            }

            return photo;

        }

        public async void AddIngredients(List<Ingredient> ingredientList)
        {
            foreach (Ingredient i in ingredientList)
            {
                Ingredient y = new Ingredient()
                {
                    RecipeID = i.RecipeID,
                    LocalIngredientID = i.LocalIngredientID,
                    Content = i.Content,
                    Quantity = i.Quantity,
                    Unit = i.Unit
                };

                await _context.ingredients.AddAsync(y);
                //await _context.SaveChangesAsync();

            }
        }

        private async void AddSteps(List<Steps> stepList)
        {
            foreach (Steps s in stepList)
            {
                Steps step = new Steps()
                {
                    RecipeID = s.RecipeID,
                    LocalStepID = s.LocalStepID,
                    Content = s.Content
                };

                await _context.steps.AddAsync(step);
                //await _context.SaveChangesAsync();

            }
        }

        private async void AddSubSteps(List<SubSteps> subStepList)
        {

            foreach (SubSteps step in subStepList)
            {

                SubSteps s = new SubSteps()
                {
                    RecipeID = step.RecipeID,
                    LocalStepID = step.LocalStepID,
                    Content = step.Content,
                    SubStepID = step.SubStepID
                };

                await _context.substeps.AddAsync(s);
                //await _context.SaveChangesAsync();
            }

        }

        private async void AddTips(List<Tips> tipList)
        {
            foreach (Tips tip in tipList)
            {
                Tips t = new Tips()
                {
                    RecipeID = tip.RecipeID,
                    LocalTipID = tip.LocalTipID,
                    Content = tip.Content,
                };

                await _context.tips.AddAsync(t);
                //await _context.SaveChangesAsync();
            }
        }

        private async void AddSubTips(List<SubTips> subTipList)
        {
            foreach (SubTips tip in subTipList)
            {
                SubTips t = new SubTips()
                {
                    RecipeID = tip.RecipeID,
                    LocalTipID = tip.LocalTipID,
                    Content = tip.Content,
                    SubTipID = (int)tip.SubTipID
                };

                await _context.subtips.AddAsync(t);
                //await _context.SaveChangesAsync();
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
