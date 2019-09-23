using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LiteDB;
using Microsoft.AspNetCore.Mvc;
using WillCore.UI.Models;

namespace WillCore.UI.Controllers
{

    /// <summary>
    /// Simple REST controller to handle categories.
    /// 
    /// To test WillCore.UI. Quick and dirty code.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private const string _testDBName = "testWillCoreDB";

        [HttpGet]
        public IEnumerable<CategoryResponse> Get()
        {
            using (var db = new LiteDatabase(_testDBName))
            {
                return db.GetCollection<CategoryResponse>("Categories").FindAll();
            }
        }

        [HttpGet("{id}")]
        public ActionResult<CategoryResponse> Get(int id)
        {
            using (var db = new LiteDatabase(_testDBName))
            {
                return db.GetCollection<CategoryResponse>("Categories").FindById(id);
            }
        }

        [HttpPost]
        public AuthenticationResponse Post([FromBody] CategoryResponse value)
        {
            using (var db = new LiteDatabase(_testDBName))
            {
                db.GetCollection<CategoryResponse>("Categories").Insert(value);
            }
            return new AuthenticationResponse { Success = true };
        }

        [HttpPut("{id}")]
        public AuthenticationResponse Put(int id, [FromBody] CategoryResponse value)
        {
            using (var db = new LiteDatabase(_testDBName))
            {
                var existingCategory = db.GetCollection<CategoryResponse>("Categories").FindById(id);
                existingCategory.Desciption = value.Desciption;
                existingCategory.Name = value.Name;
                existingCategory.Image = value.Image;
                db.GetCollection<CategoryResponse>("Categories").Update(existingCategory);
            }
            return new AuthenticationResponse { Success = true };
        }

        [HttpDelete("{id}")]
        public AuthenticationResponse Delete(int id)
        {
            using (var db = new LiteDatabase(_testDBName))
            {
                db.GetCollection<CategoryResponse>("Categories").Delete(id);
            }
            return new AuthenticationResponse { Success = true };
        }
    }
}
