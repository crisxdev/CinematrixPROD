using AutoMapper;
using Cinematrix.API.Datos;
using Cinematrix.API.DTO;
using Cinematrix.API.Entidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

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
            diaIni = dia.HasValue ? dia.Value : DateTime.Now;
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



            //Misma consulta pero trae solo las pelis que tienen sesiones ese día

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
            //Devuelve una lista de fechas a partir de una cantidad que viene por parámetro.
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


        [HttpGet("tarifas")]

        public async Task<ActionResult<IEnumerable<TarifaDTO>>> Get()
        {

            //Devuelve la lista de tarifas disponibles
            var tarifas = await context.Tarifas.Select(p => new TarifaDTO
            {
                Nombre = p.Nombre,
                Precio = p.Precio
            }).ToListAsync();


            return Ok(tarifas);

        }

        [HttpPost("compra/{id:int}")]
        public async Task<ActionResult> PostInicioCompra(int id, [FromBody] List<CreacionCompraDTO> creacionCompraDTO)
        {


            //Método sin implementar
            var sesion = await context.Sesiones.Where(x => x.Id == id).ToListAsync();

            if (sesion.Count == 0) return BadRequest($"Sesión {id} no existe");
            var nombresTarifas = creacionCompraDTO.Select(x => x.Nombre).ToList();
            decimal total = 0;
            var tarifasResult = await context.Tarifas.Where(t => nombresTarifas.Contains(t.Nombre)).ToListAsync();


            for (int i = 0; i < creacionCompraDTO.Count; i++)
            {
                if (tarifasResult[i].Nombre == nombresTarifas[i])
                {
                    total += tarifasResult[i].Precio ?? 0 * creacionCompraDTO[i].Cantidad;
                }
               

            }
            return Ok();


        }
    }
}
