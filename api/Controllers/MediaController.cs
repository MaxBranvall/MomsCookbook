﻿using System;
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
    public class MediaController : ControllerBase
    {

        private IWebHostEnvironment _env;

        public MediaController(IWebHostEnvironment env)
        {
            _env = env;
        }

        RecipeContext _context = new RecipeContext();

        //// GET: api/Media
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //// GET: api/Media/5
        //[HttpGet("{name}", Name = "Get")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //POST: api/Media
        [HttpPost]
        public async void UploadImage([FromForm] FormModel formModel)
        {

            /*
             Upload renamed image to specified folder. Update recipe entry with generated
             file path.
             */

            var id = int.Parse(formModel.ID);
            IFormFile file = formModel.File;

            string dt = DateTime.Now.ToString("yyyymmddhhmmss");
            string fileName = string.Format("{0}{1}{2}", id, dt, file.FileName);
            string actualFilePath = "../../../../images/mainImages/" + string.Format("{0}", fileName);

            string apiFilePath = _env.ContentRootPath + "/../images/mainImages/" + string.Format("{0}", fileName);

            await using (var stream = new FileStream(apiFilePath, FileMode.Create))
            {
                file.CopyTo(stream);
                //await file.CopyToAsync(stream);
            }

            Recipe recipe = new Recipe() { ID = id, ImagePath = actualFilePath };

            _context.recipe.Attach(recipe);
            _context.Entry(recipe).Property(p => p.ImagePath).IsModified = true;
            await _context.SaveChangesAsync();

        }

        //// POST: api/Media
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //}

        // PUT: api/Media/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
