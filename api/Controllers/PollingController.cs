using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("v1/[controller]")]
    [ApiController]
    public class PollingController : ControllerBase
    {
        [HttpGet]
        public ActionResult Poll()
        {
            return Ok();
        }
    }
}
