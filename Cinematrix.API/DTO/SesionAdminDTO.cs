namespace Cinematrix.API.DTO
{
    public class SesionAdminDTO
    {
        public required string Pelicula { get; set; } = null!;

        public required string Sala { get; set; } = null!;

        public required int Id { get; set; }

   
        public required DateTime Inicio { get; set; }

        public required DateTime Fin { get; set; }

        public required string Estado { get; set; } = null!;
    }
}
