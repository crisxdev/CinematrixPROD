using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cinematrix.API.Controllers
{
    [ApiController]
    [Route("api/admin/peliculas")]
    [Authorize]
    public class PeliculasController:ControllerBase
    {

        [HttpGet]
        public ActionResult Pelicula()
        {
            return Ok();
        }
    }
}
