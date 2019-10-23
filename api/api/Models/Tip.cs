using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Tip
    {
        public int RecipeID { get; set; }
        public int LocalTipID { get; set; }
        public string Content { get; set; }
#nullable enable
        public List<Tip>? SubTips { get; set; }
        public int? SubTipID { get; set; }
    }
}
