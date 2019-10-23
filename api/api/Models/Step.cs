using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Step
    {
        public int RecipeID { get; set; }
        public int LocalStepID { get; set; }
        public string Content { get; set; }
#nullable enable
        public List<Step>? SubSteps { get; set; }
        public int? SubStepID { get; set; }
    }
}
