namespace Cinematrix.API.DTO
{
    public class EditarPeliculaDTO
    {
        public required List<string> Categorias { get; set; }
        public required List<string> Calificaciones { get; set; }
        public required List<string> Formatos { get; set; }

        public  PeliculaDTO? Pelicula { get; set; }
    }
}
