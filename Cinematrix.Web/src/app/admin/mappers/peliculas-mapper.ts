import { InfoPelicula } from "../interfaces/info-pelicula";
import { Pelicula } from "../interfaces/pelicula.interface";
import { RESTInfoPelicula } from "../interfaces/rest-info-pelicula";
import { RESTPelicula } from "../interfaces/rest-pelicula.interface";


export class PeliculasMapper {
  static mapRESTFilmToFilm = (pelicula: RESTPelicula): Pelicula => {
    return {
      id: pelicula.id,
      titulo: pelicula.titulo,
      categoria: pelicula.categoria,
      anio: pelicula.anio,
      calificacion: pelicula.calificacion,
      duracion: pelicula.duracion,
      formato: pelicula.formato,
      imagen: pelicula.imagen,
      poster: pelicula.poster,
      sinopsis: pelicula.sinopsis,
      trailer: pelicula.trailer,
      sesiones: pelicula.sesiones,
    };





  };


static mapRESTInfoPeliculaToInfoPelicula = (
    rest: RESTInfoPelicula
  ): InfoPelicula => {
    return {
      categorias: rest.categorias,
      calificaciones: rest.calificaciones,
      formatos: rest.formatos,
      pelicula: this.mapRESTFilmToFilm(rest.pelicula),
    };
  };
}
