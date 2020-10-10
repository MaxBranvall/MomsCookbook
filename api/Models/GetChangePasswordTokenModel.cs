using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class GetChangePasswordTokenModel
    {
        [Required]
        public string EmailAddress { get; set; }
    }
}
