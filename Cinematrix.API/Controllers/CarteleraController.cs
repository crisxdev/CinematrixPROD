using AutoMapper;
using Cinematrix.API.Datos;
using Cinematrix.API.DTO;
using Cinematrix.API.Entidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Cinematrix.API.Common;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Transactions;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Diagnostics;

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

        




        public async Task<ActionResult<CarteleraDTO>> Get([FromQuery] DateTime? dia)
        {

            DateTime ahora = DateTime.Now;
            DateTime diaFin;
            DateTime diaIni;
            //diaIni = dia.HasValue ? new DateTime(dia.Value.Year, dia.Value.Month, dia.Value.Day) : DateTime.Now.Date;
            diaIni = !dia.HasValue || dia.Value.Date == DateTime.Now.Date ? ahora : new DateTime(dia.Value.Year, dia.Value.Month, dia.Value.Day);
            //if (diaIni.Day != DateTime.Now.Day)
            //{
            //    if (dia.HasValue)
            //    {
            //        diaIni = new DateTime(dia.Value.Year, dia.Value.Month, dia.Value.Day);
            //    }

            //}
            diaFin = diaIni.Date.AddDays(1);

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

            System.Diagnostics.Debug.WriteLine(diaIni.ToString("dd/MM/yyyy HH/mm/ss"), diaFin.ToString("dd/MM/yyyy HH/mm/ss"));

            var peliculas = await context.Peliculas.Include(x => x.Sesiones).Where(x => x.Sesiones.Any(s => s.Inicio > diaIni && s.Inicio < diaFin && s.Estado == EstadoSesion.Activa))
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
                    Sesiones = p.Sesiones.Where(s => s.Inicio >= diaIni && s.Inicio < diaFin && s.Estado == EstadoSesion.Activa).Select(s => new SesionDTO
                    {
                        Id = s.Id,
                        Inicio = s.Inicio
                    }).ToList()

                }

               )

              .ToListAsync();

            foreach (var pelicula in peliculas)
            {
                System.Diagnostics.Debug.WriteLine(pelicula.Titulo);
            }

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
        public async Task<ActionResult> PostInicioCompra(int id, [FromBody] List<CreacionCompraDTO> creacionCompraDTO, [FromQuery] int? idCompra )
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
                    total += (tarifasResult[i].Precio ?? 0) * creacionCompraDTO[i].Cantidad;
                }


            }

            Compra compra = new Compra
            {
                Inicio = DateTime.Now,
                Fin = DateTime.Now.AddMinutes(15),
                Autorizacion = "",
                Canal = CanalCompra.Online,
                Estado = EstadoCompra.EnProceso,
                SesionId = id,
                Medio = MedioCompra.Paypal,
                Importe = total

            };

       

            try
            {

                //NUEVO
                if(idCompra is null)
                {
                    System.Diagnostics.Debug.WriteLine("no existe id compra" + idCompra);
                    context.Compras.Add(compra);
                    await context.SaveChangesAsync();
                }
                
              
                
                var sala = await context.Sesiones.Where(s => s.Id == id).Select(x =>
                new
                {
                    SalaId = x.Id,
                    Plano = x.Sala.Plano,

                }
                ).ToListAsync();

                var ocupacionSala = await context.Ocupaciones.Where(x => x.SesionId == id).ToListAsync();

                if (sala[0].Plano is not null)
                {
                    System.Diagnostics.Debug.WriteLine("ENTROOO");
                    var aforo = TransformaAforo.TransformarAforo(sala[0].Plano, ocupacionSala);

                    //Nuevo
                    return Ok(new
                    {
                        asientos = aforo,
                        compraId = idCompra??compra.Id
                    });
                }

            } catch (Exception ex)
            {
                return StatusCode(500, "Ha ocurrido un error en la inicialización de compra");
            }

            Console.WriteLine(compra.Id);


            return Ok();




        }


        [HttpPost("compra/intermedio/{idCompra:int}")]

        public async Task<ActionResult> PostFinalCompra(int idCompra, [FromBody] CompraIntermediaDTO compraIntermediaDTO)
        {
            var compra = await context.Compras.FirstOrDefaultAsync(x => x.Id == idCompra);
            if (compra is null)
            {
                return BadRequest("La compra no existe");
            }

            var asientosSeleccionados = compraIntermediaDTO.AsientosSeleccionados;
            var tarifasSeleccionadas = compraIntermediaDTO.Tarifas;

            List<Ocupacion> ocupaciones = [];
            //var OcupacionesYaExisten = await context.Ocupaciones.Where(t => asientosSeleccionados.Contains(t.Butaca)).ToListAsync();
            //if (OcupacionesYaExisten.Count > 0)
            //{
            //    return BadRequest("Alguno de los asientos está reservado.");
            //}

            int indexAsiento = 0;
            using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                var ocupacionesExistentesCompra = await context.Ocupaciones.Where(o => o.CompraId == idCompra).ToListAsync();
                if (ocupacionesExistentesCompra.Count > 0) context.Ocupaciones.RemoveRange(ocupacionesExistentesCompra);
                await context.SaveChangesAsync();
                foreach (var tarifa in tarifasSeleccionadas)
                {
                    for (int i = 0; i < tarifa.Cantidad; i++)
                    {
                        ocupaciones.Add(new Ocupacion
                        {
                            CompraId = idCompra,
                            SesionId = compra.SesionId,
                            Butaca = asientosSeleccionados[indexAsiento],
                            Estado = EstadoButaca.Reservada,
                            TarifaNombre = tarifa.Nombre

                        });
                        indexAsiento++;
                    }
                }
               
                //NUEVO
                var OcupacionesYaExisten = await context.Ocupaciones.Where(t => asientosSeleccionados.Contains(t.Butaca) && t.SesionId==compra.SesionId).ToListAsync();
                if (OcupacionesYaExisten.Any())
                {
                   
                    return BadRequest("Alguno de los asientos está reservado.");
                }
                context.Ocupaciones.AddRange(ocupaciones);

                await context.SaveChangesAsync();
                await transaction.CommitAsync();

            } catch (Exception e)
            {
                await transaction.RollbackAsync(); // Si ha habido algún error en la reserva o en el proceso, revierte los cambios.
                return StatusCode(500, e.Message);
            }

            return Ok();

        }


        [HttpPost("compra/cancelar/{idCompra:int}")]
        public async Task<ActionResult> CancelarCompra(int idCompra) {

            var compra = await context.Compras.FirstOrDefaultAsync(c => c.Id == idCompra);
      
            if (compra is null)
            {
                
                return BadRequest($"No existe una compra con {idCompra}");
            }

            if(compra.Estado==EstadoCompra.EnProceso || compra.Estado==EstadoCompra.Cancelada)
            {
                compra.Estado = EstadoCompra.Cancelada;
            }
            else
            {
                return BadRequest($"No se puede cancelar la compra {idCompra}");
            }


                var ocupaciones = await context.Ocupaciones.Where(o => o.CompraId == compra.Id).ToListAsync();

            if (ocupaciones.Count > 0)
            {
                context.Ocupaciones.RemoveRange(ocupaciones);
                
            }
            await context.SaveChangesAsync();


            return Ok(idCompra);
        }

        [HttpGet("compra/detalle/{idCompra:int}")]

        public async Task<ActionResult<DetalleCompraDTO>> getDetalleCompra(int idCompra)
        {
            var compra = await context.Compras.FirstOrDefaultAsync(c => c.Id == idCompra);

            if(compra is null)
            {
                return BadRequest($"No existe el id de compra {idCompra}");
            }

            if (compra.Estado == EstadoCompra.Cancelada)
            {
                return BadRequest($"La compra con id ${idCompra} está cancelada");
            }

            var sesion = await context.Sesiones.FirstOrDefaultAsync(s => s.Id == compra.SesionId);

            if (sesion is null)
            {
                return BadRequest($"La compra con id ${idCompra} no tiene sesión");
            }

            var sala = await context.Salas.Where(s => s.Id == sesion.SalaId).ToListAsync();

            if(sala is null)
            {
                return BadRequest($"La compra con id ${idCompra} no tiene sala");
            }

            var pelicula = await context.Sesiones.Where(s => s.Id == sesion.Id).Select(s => s.Pelicula).FirstOrDefaultAsync();

            if(pelicula is null)
            {
                return BadRequest($"La compra con id ${idCompra} no tiene película");
            }

            var tarifas = await context.Ocupaciones.Where(o => o.CompraId == compra.Id).GroupBy(x => x.TarifaNombre).Select(y => new DetalleTarifaDTO { Nombre = y.Key, Cantidad = y.Count() }).ToListAsync();

            var ocupaciones = await context.Ocupaciones.Where(x => x.CompraId == compra.Id).Select(x=>x.Butaca).ToListAsync();

            return Ok(
                new DetalleCompraDTO { Pelicula = pelicula.Titulo, Sala = sala[0].Nombre, Fecha = sesion.Inicio, Tarifas = tarifas, Total = compra.Importe ?? 0 , Butacas=ocupaciones});

        }


        [HttpPost("compra/finalizar/{id:int}")]
        public async Task<ActionResult> FinalizarCompra(int id)
        {
            System.Diagnostics.Debug.WriteLine(id);
            var compra = await context.Compras.FirstOrDefaultAsync(c => c.Id == id);
            if (compra is null)
            {
                System.Diagnostics.Debug.WriteLine("No existe la compra");
                return NotFound("La compra no existe.");
            }

            if (compra.Estado != EstadoCompra.EnProceso)
            {
                System.Diagnostics.Debug.WriteLine("No existe la compra 1");
                return BadRequest("No se puede finalizar una compra que no está en proceso");
            }


            using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                var OcupacionesYaExisten = await context.Ocupaciones.Where(t => t.CompraId == id).ToListAsync();
                if (OcupacionesYaExisten.Count == 0)
                {
                    System.Diagnostics.Debug.WriteLine("La ocupación ya existe");
                    return BadRequest("No hay asientos reservados para la compra");
                }



                foreach (var ocupacion in OcupacionesYaExisten)
                {
                    ocupacion.Estado = EstadoButaca.Pagada;
                }
                compra.Estado = EstadoCompra.Aprobada;

                await context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok(new
                {
                    mensaje="Compra realizada correctamente"
                });

            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Error al finalizar la compra: " + ex.InnerException);
            }
            

        }


    }

          



    }
