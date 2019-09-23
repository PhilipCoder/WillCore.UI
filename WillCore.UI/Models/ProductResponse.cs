using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WillCore.UI.Models
{
    public class ProductResponse
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string Desciption { get; set; }
        public decimal Price { get; set; }
        public bool IsInStock { get; set; }
    }
}
