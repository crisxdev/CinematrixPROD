namespace Cinematrix.API.DTO
{
    public class DetalleCompraDTO
    {
        //Deberia devolver, Fecha y hora de la sesion, sala, tarifas y cantidad de ellas, total y pelicula

        public DateTime Fecha { get; set; }
        public required string Sala { get; set; }

        public List<DetalleTarifaDTO> Tarifas {get;set;}

        public decimal Total { get; set; }

        public required string Pelicula { get; set; }

    }
}
