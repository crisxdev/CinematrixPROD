namespace Cinematrix.API.DTO
{
    public class CompraIntermediaDTO
    {
        public List<CreacionCompraDTO> Tarifas { get; set; }
        public int IdCompra { get; set; }

        public List<string> AsientosSeleccionados { get; set; }
        
    }
}
