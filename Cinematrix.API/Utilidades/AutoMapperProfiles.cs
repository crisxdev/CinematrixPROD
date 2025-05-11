using AutoMapper;
using Cinematrix.API.DTO;
using Cinematrix.API.Entidades;

namespace Cinematrix.API.Utilidades
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Pelicula, PeliculaDTO>();

            CreateMap<Sesion, SesionDTO>();

            
        }
    }
}
