using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace api.Models
{
    public class FormModel
    {
        public string ID { get; set; }
        public IFormFile File { get; set; }
    }
}
