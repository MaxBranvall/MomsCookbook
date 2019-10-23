using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql;
using api.Models;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        // GET: api/Recipe
        [HttpGet]
        public IEnumerable<Recipe> Get()
        {
            List<Recipe> list = new List<Recipe>();
            list.Add(new Recipe() 
            {
                Name = "Chicken", 
                Image = new Photo() {RecipeID=0, Name= ".. /assets/placeholders/chicken.jpg" },
                Description = null, 
                Category= null, 
                CookTimeH = 1, 
                CookTimeM = 45, 
                PrepTimeH = 0, 
                PrepTimeM = 20,
                Ingredients = null,
                Steps = null,
                Tips = null
            });
            list.Add(new Recipe()
            {
                Name = "Beef",
                Image = new Photo() { RecipeID = 0, Name = ".. /assets/placeholders/chicken.jpg" },
                Description = null,
                Category = null,
                CookTimeH = 1,
                CookTimeM = 30,
                PrepTimeH = 0,
                PrepTimeM = 45,
                Ingredients = null,
                Steps = null,
                Tips = null
            });
            list.Add(new Recipe()
            {
                Name = "Beef",
                Image = new Photo() { RecipeID = 0, Name = ".. /assets/placeholders/chicken.jpg" },
                Description = null,
                Category = null,
                CookTimeH = 1,
                CookTimeM = 30,
                PrepTimeH = 0,
                PrepTimeM = 45,
                Ingredients = null,
                Steps = null,
                Tips = null
            });
            return list;
        }

        // GET: api/Recipe/5
        [HttpGet("{name}", Name = "Get")]
        public IEnumerable<Recipe> Get(string name)
        {
            List<Recipe> list = new List<Recipe>();
            list.Add(new Recipe()
            {
                Name = "Chicken",
                Image = new Photo() { RecipeID = 0, Name = ".. /assets/placeholders/chicken.jpg" },
                Description = null,
                Category = null,
                CookTimeH = 1,
                CookTimeM = 45,
                PrepTimeH = 0,
                PrepTimeM = 20,
                Ingredients = null,
                Steps = null,
                Tips = null
            });
            list.Add(new Recipe()
            {
                Name = "Beef",
                Image = new Photo() { RecipeID = 0, Name = ".. /assets/placeholders/chicken.jpg" },
                Description = null,
                Category = null,
                CookTimeH = 1,
                CookTimeM = 30,
                PrepTimeH = 0,
                PrepTimeM = 45,
                Ingredients = null,
                Steps = null,
                Tips = null
            });

            foreach (Recipe e in list)
            {
                if (name == e.Name)
                {
                    return new List<Recipe> { e };
                }
            }

            return new List<Recipe>();

            //return "value";
        }

        //// POST: api/Recipe
        //[HttpPost]
        //public void Post([FromBody] Recipe value)
        //{
        //}

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
