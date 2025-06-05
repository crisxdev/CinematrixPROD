using AutoMapper;
using Cinematrix.API.Common;
using Cinematrix.API.Datos;
using Cinematrix.API.DTO;
using Cinematrix.API.Entidades;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Cinematrix.API.Controllers
{
    [Route("api/admin/sesiones")]
    [Authorize]
    public class SesionesController : ControllerBase
    {
        private readonly CinematrixContext context;
        private readonly IMapper mapper;

        public SesionesController(CinematrixContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }


        // Método que devuelva las sesiones, peliculas y nombre de sala para pantalla principal
        // Ej: [id,sala,pelicula,inicio,final,estado]
        [HttpGet]
        public async Task<ActionResult<List<SesionAdminDTO>>> Get([FromQuery] DateTime? fecha, [FromQuery] string? estado)
        {
            var sesiones = fecha.HasValue && estado != null ?
                await context.Sesiones.Include(x => x.Pelicula).Include(x => x.Sala).Where(x => x.Inicio.Date == fecha.Value.Date && x.Estado == estado).OrderByDescending(x => x.Inicio).ToListAsync() :
                fecha.HasValue ? await context.Sesiones.Include(x => x.Pelicula).Include(x => x.Sala).Where(x => x.Inicio.Date == fecha.Value.Date).OrderByDescending(x => x.Inicio).ToListAsync() :
                estado != null ? await context.Sesiones.Include(x => x.Pelicula).Include(x => x.Sala).Where(x => x.Estado == estado).OrderByDescending(x => x.Inicio).ToListAsync() :
                await context.Sesiones.Include(x => x.Pelicula).Include(x => x.Sala).OrderByDescending(x => x.Inicio).ToListAsync();

            if (sesiones.Count == 0)
            {
                return NotFound("No se ha encontrado sesiones para los filtros establecidos");
            }

            List<SesionAdminDTO> listaSesiones = [];
            foreach (var sesion in sesiones)
            {
                listaSesiones.Add(new SesionAdminDTO { Estado = sesion.Estado, Sala = sesion.Sala.Nombre, Inicio = sesion.Inicio, Fin = sesion.Fin, Id = sesion.Id, Pelicula = sesion.Pelicula.Titulo });
            }

            return Ok(listaSesiones);
        }


        [HttpPut]
        [Route("{idSesion}")]
        public async Task<ActionResult> Put([FromBody] PutEditarSesionDTO sesion, int idSesion)
        {
          
            if (idSesion != sesion.Id)
            {
                return BadRequest("El Id no coincide");
            }

            var sesionDB = await context.Sesiones.FirstOrDefaultAsync(x => x.Id == idSesion);
            if(sesionDB is null)
            {
                return NotFound($"No se puede actualizar la sesión {idSesion}, no existe");
            }
            var ocupacion = await context.Ocupaciones.Where(x => x.SesionId == idSesion).ToListAsync();
            var termino = DateTime.Now > sesionDB.Fin;
            if (ocupacion.Count>0 && sesionDB.Estado==EstadoSesion.Activa)
            {
                if (sesion.Estado == EstadoSesion.Terminada)
                {
                  
                    if (!termino) return BadRequest($"No se puede cambiar la sesión a terminada, debe ser posterior a la fecha actual.Id:{idSesion}");
                }
                else
                {
                    return BadRequest($"No se puede cancelar una sesión activa con ocupaciones");
                }
            }
            if (sesion.Estado == EstadoSesion.Terminada)
            {
                if (!termino)
                    return BadRequest("No se puede marcar como terminada una sesión que no ha terminado");

                if (sesionDB.Estado == EstadoSesion.Cancelada)
                    return BadRequest("No se puede cambiar la sesión a terminada si está cancelada");
            }

            if (sesion.Estado == EstadoSesion.Cancelada)
            {
                if (termino)
                {
                    return BadRequest("No se puede cancelar una sesión que ya ha comenzado");
                }
            }

            if (sesion.Estado == EstadoSesion.Programada)
            {
                if (termino)
                {
                    return BadRequest("No se puede cambiar a programada una sesión que ya terminó");
                }
            }









            try
            {
                sesionDB.Estado = sesion.Estado;

                await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en modificación de película: {ex.Message}");
            }

            return NoContent();
           
        }


        [HttpGet]
        [Route("{idSesion}")]
        public async Task<ActionResult<EditarSesionDTO>> GetById(int idSesion)
        {
            var sesion = await context.Sesiones.Include(x => x.Pelicula).Include(x => x.Sala).FirstOrDefaultAsync(x => x.Id == idSesion);
            var salas = await context.Salas.Select(x => new SalaInfoDTO { Id = x.Id, Nombre = x.Nombre }).ToListAsync();
            var peliculas = await context.Peliculas.Select(x => new PeliculaInfoDTO { Id = x.Id, Titulo = x.Titulo }).ToListAsync();

            if (sesion is null)
            {
                return NotFound($"No existe una sesión con id {idSesion}");
            }

            return new EditarSesionDTO
            {
                Peliculas = peliculas,
                Salas = salas,
                Sesion = new SesionAdminDTO
                {
                    Sala = sesion.Sala.Nombre,
                    Estado = sesion.Estado,
                    Fin = sesion.Fin,
                    Id = sesion.Id,
                    Inicio = sesion.Inicio,
                    Pelicula = sesion.Pelicula.Titulo
                }


            };



            // Método que devuelva información de una sesión, películas y salas disponibles

        }


        [HttpGet]
        [Route("info")]
        public async Task<ActionResult<EditarSesionDTO>> GetInfo()
        {
       
            var salas = await context.Salas.Select(x => new SalaInfoDTO { Id = x.Id, Nombre = x.Nombre }).ToListAsync();
            var peliculas = await context.Peliculas.Select(x => new PeliculaInfoDTO { Id = x.Id, Titulo = x.Titulo }).ToListAsync();


            return new EditarSesionDTO
            {
                Peliculas = peliculas,
                Salas = salas,
            };



            // Método que devuelva información de una sesión, películas y salas disponibles

        }

        [HttpGet]
        [Route("fecha/siguiente")]
        public async Task<ActionResult<DateTime>> Get([FromQuery]DateTime fecha, [FromQuery] string sala)
        {
            var dia = fecha.Date;
            var desde = dia.Add(Horario.primeraHora);
            var hasta = dia.Add(Horario.ultimaHora);

            var sesiones = await context.Sesiones
        .Where(s => s.Sala.Nombre == sala && s.Inicio.Date == dia)
        .OrderBy(s => s.Inicio)
        .ToListAsync();

            if (sesiones.Count == 0)
            {
                return desde;
            }

            var ultimaSesion = sesiones.Last();
            var proximaHora = ultimaSesion.Fin.AddMinutes(20);

            if ( proximaHora <= hasta )
            {
                return proximaHora;
            }
            else
            {
                return BadRequest("No hay más horas disponibles para ese día");
            }

        }



        [HttpPost]
        [Route("crear")]
        public async Task<ActionResult> Post([FromBody] PutEditarSesionDTO sesion)
        {

            try
            {
                var nuevaSesion = new Sesion();
                nuevaSesion.Estado = sesion.Estado;
                if (sesion.Inicio.HasValue) nuevaSesion.Inicio = sesion.Inicio.Value;
                var pelicula = await context.Peliculas.Where(x => x.Id == sesion.IdPelicula).FirstOrDefaultAsync();
                if (pelicula is null) return NotFound("No se encuentra la película asignada");
                nuevaSesion.Fin = nuevaSesion.Inicio.AddMinutes(pelicula.Duracion??90);
                nuevaSesion.SalaId = sesion.IdSala;
                nuevaSesion.PeliculaId = sesion.IdPelicula;

                context.Sesiones.Add(nuevaSesion);
                await context.SaveChangesAsync();


            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al añadir la sesión: {ex.InnerException}");
            }

            return Ok();

        }

    }
}
