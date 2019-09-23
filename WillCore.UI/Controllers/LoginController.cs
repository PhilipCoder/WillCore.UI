using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WillCore.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        [HttpPost]
        public AuthenticationResponse Validate([FromBody]AuthenticationRequest authRequest)
        {
            return new AuthenticationResponse
            {
                Success = authRequest.EMail == "test@gmail.com" && authRequest.Password == "WillCore.UI"
            };
        }
    }
}