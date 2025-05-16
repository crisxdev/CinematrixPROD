using AutoMapper;
using Cinematrix.API.Datos;
using Cinematrix.API.DTO;
using Cinematrix.API.Entidades;
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

       
        public async Task<ActionResult<CarteleraDTO>> Get([FromQuery] DateTime? dia)
        {

            
            
            DateTime diaFin;
            DateTime diaIni;
            diaIni = dia.HasValue?dia.Value : DateTime.Now;
            diaFin = diaIni.AddDays(1);

            // Busca películas por un día determinado, trae la info de las pelis aunque no tengan sesiones ese día.
           
            //var peliculas = await context.Peliculas.Include(x => x.Sesiones)
            //  .Select(p => new PeliculaDTO
            //  {
            //      Id = p.Id,
            //      Titulo = p.Titulo,
            //      Imagen = p.Imagen,
            //      Anio = p.Anio,
            //      Duracion = p.Duracion,
            //      Formato = p.Formato,
            //      Categoria = p.Categoria,
            //      Poster = p.Poster,
            //      Calificacion = p.Calificacion,
            //      Sinopsis = p.Sinopsis,
            //      Trailer = p.Trailer,
            //      Sesiones = p.Sesiones.Where(s => s.Inicio >= diaIni && s.Inicio < diaFin).Select(s => new SesionDTO
            //      {
            //          Id = s.Id,
            //          Inicio = s.Inicio
            //      }).ToList()
            //  }
            //  )

            //  .ToListAsync();



            //Misma consulta pero trae solo las pelis que tienen sesiones

            var peliculas = await context.Peliculas.Include(x => x.Sesiones).Where(x => x.Sesiones.Any(s => s.Inicio > diaIni && s.Inicio < diaFin))
                .Select(p => new PeliculaDTO
              {
                   Id = p.Id,
                    Titulo = p.Titulo,
                   Imagen = p.Imagen,
                   Anio = p.Anio,
                   Duracion = p.Duracion,
                    Formato = p.Formato,
                    Categoria = p.Categoria,
                   Poster = p.Poster,
                    Calificacion = p.Calificacion,
                  Sinopsis = p.Sinopsis,
                  Trailer = p.Trailer,
                    Sesiones = p.Sesiones.Where(s => s.Inicio >= diaIni && s.Inicio < diaFin).Select(s => new SesionDTO
                   {
                        Id = s.Id,
                       Inicio = s.Inicio
                   }).ToList()

              }

               )

              .ToListAsync();



            var peliculasDTO = mapper.Map<List<PeliculaDTO>>(peliculas);
            var resultado = new CarteleraDTO { Peliculas = peliculasDTO };

            return Ok(resultado.Peliculas);



        }


        [HttpGet("fechas")]
        public ActionResult<Fechas> Get([FromQuery] int? cantidad)
        {
            var fechaAct = DateTime.Now;
            List<DateTime> listaFechas = [];

            for (int i = 0; i < cantidad; i++)
            {
                listaFechas.Add(fechaAct.AddDays(i));
            }

            Fechas fechasObj = new Fechas
            {
                listaFechas = listaFechas
            };
            return Ok(fechasObj);

        }



       




    }
}
