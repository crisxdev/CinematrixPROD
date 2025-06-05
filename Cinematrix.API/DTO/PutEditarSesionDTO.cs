namespace Cinematrix.API.DTO
{
    public class PutEditarSesionDTO
    {
      


            public int? Id { get; set; }

            public required int IdPelicula { get; set; }

            public required int IdSala { get; set; }

            public required string Estado { get; set; } = null!;

            public DateTime? Inicio { get; set; }
        }
    
}
