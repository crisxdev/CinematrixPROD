using AutoMapper;
using Cinematrix.API.Common;
using Cinematrix.API.Datos;
using Cinematrix.API.DTO;
using Cinematrix.API.Entidades;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cinematrix.API.Controllers
{
    [ApiController]
    [Route("api/admin/peliculas")]
    [Authorize]
    public class PeliculasController:ControllerBase
    {

        private readonly CinematrixContext context;
        private readonly IMapper mapper;

        public PeliculasController(CinematrixContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }


        [HttpGet]
        public async Task<ActionResult<List<PeliculaDTO>>> Pelicula()
        {

            var peliculas = await context.Peliculas.ToListAsync();

            var peliculasDTO = mapper.Map<List<PeliculaDTO>>(peliculas);

            return peliculasDTO;

        }


        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<EditarPeliculaDTO>> Pelicula(int id)
        {

            var pelicula = await context.Peliculas.FirstOrDefaultAsync(x=>x.Id==id);
            if (pelicula is null)
            {
                return NotFound();
            }

            var peliculaDTO = mapper.Map<PeliculaDTO>(pelicula);


            return new EditarPeliculaDTO { Calificaciones=CalificacionesPelicula.Todas, Categorias=CategoriaPelicula.Todas, 
            Formatos=FormatosPeliculas.Todas,Pelicula=peliculaDTO
            };

        }


        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult> PutPelicula(int id, [FromBody] Pelicula pelicula)
        {

            if (id != pelicula.Id)
            {
                return BadRequest("El Id no coincide");
            }

            var peliculaDB = await context.Peliculas.FirstOrDefaultAsync(x => x.Id == id);

            if (peliculaDB is null)
            {
                return NotFound();
            }

            try {

                peliculaDB.Titulo = pelicula.Titulo;
                peliculaDB.Categoria = pelicula.Categoria;
                peliculaDB.Anio = pelicula.Anio;
                peliculaDB.Calificacion = pelicula.Calificacion;
                peliculaDB.Duracion = pelicula.Duracion;
                peliculaDB.Formato = pelicula.Formato;
                peliculaDB.Imagen = pelicula.Imagen;
                peliculaDB.Poster = pelicula.Poster;
                peliculaDB.Sinopsis = pelicula.Sinopsis;
                peliculaDB.Trailer = pelicula.Trailer;

                await context.SaveChangesAsync();

            }catch(Exception ex)
            {
                return StatusCode(500, $"Error en modificación de película: {ex.Message}");
            }

            return NoContent();

        }


        [HttpPost]
        public async Task<ActionResult> PostPelicula([FromBody] Pelicula pelicula)
        {
            try
            {
                var peliculaDB = new Pelicula
                {
                    Poster=pelicula.Poster,
                    Anio=pelicula.Anio,
                    Calificacion=pelicula.Calificacion,
                    Duracion=pelicula.Duracion,
                    Categoria=pelicula.Categoria,
                    Formato=pelicula.Formato,
                    Imagen=pelicula.Imagen,
                    Sinopsis=pelicula.Sinopsis,
                    Titulo=pelicula.Titulo,
                    Trailer=pelicula.Trailer,
                };
                await context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Error en inserción de película: {ex.Message}");
            }

            return NoContent();

        }

    }
}
