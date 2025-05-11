using AutoMapper;
using Cinematrix.API.Datos;
using Cinematrix.API.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cinematrix.API.Controllers
{
    [Route("api/cartelera")]
    [ApiController]
    public class CarteleraController : ControllerBase
    {


        private readonly CinematrixContext context;
        private readonly IMapper mapper;
        public CarteleraController(CinematrixContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public IMapper Mapper { get; }

        [HttpGet]
        public async Task<ActionResult<CarteleraDTO>> Get()
        {
            var peliculas = await context.Peliculas.Include(x => x.Sesiones).ToListAsync();


            if (peliculas.Count==0)
            {
                return NotFound();
            }

            var peliculasDTO = mapper.Map<List<PeliculaDTO>>(peliculas);
            var resultado = new CarteleraDTO { Peliculas = peliculasDTO };

            return Ok(resultado);



        }



    }
}
