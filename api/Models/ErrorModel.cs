using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Models
{
    public class ErrorModel
    {
        public string message { get; set; }
#nullable enable
        public int? statusCode { get; set; }
    }
}
