using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WillCore.UI.Models
{
    public class CategoryResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Desciption { get; set; }
        public byte[] Image { get; set; }
    }
}
