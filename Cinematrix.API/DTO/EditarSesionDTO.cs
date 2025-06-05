namespace Cinematrix.API.DTO
{
    public class EditarSesionDTO
    {

     
            public required List<PeliculaInfoDTO> Peliculas { get; set; }
            public required List<SalaInfoDTO> Salas { get; set; }
            public SesionAdminDTO? Sesion { get; set; }
       
    }

 

}
