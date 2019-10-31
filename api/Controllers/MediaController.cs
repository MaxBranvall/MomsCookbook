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
    public class MediaController : ControllerBase
    {

        private IWebHostEnvironment _env;

        public MediaController(IWebHostEnvironment env)
        {
            _env = env;
        }

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
        public async void UploadImage(IFormFile filesData)
        {

            string dt = DateTime.Now.ToString("yyyy-mm-dd_hh-mm-ss");
            string fileName = string.Format("{0}_{1}_{2}", 0, dt, "newimg.jpg");
            string filePath = _env.ContentRootPath + "/uploads/" + string.Format("{0}", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await filesData.CopyToAsync(stream);
            }

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
