import { Pelicula, Sesion } from '../interfaces/pelicula.interface';
import {
  RESTPelicula,
  RESTSesion,
} from '../interfaces/rest-pelicula.interface';

export class CarteleraMapper {
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
      sesiones: this.mapRestSesionArrayToSesionArray(pelicula.sesiones),
    };
  };

  static mapRestSesionArrayToSesionArray(sesiones: RESTSesion[]): Sesion[] {
    return sesiones.map((sesion) => {
      return {
        id: sesion.id,
        inicio: sesion.inicio,
        salaId: sesion.salaId,
      };
    });
  }

  static mapRESTfilmArrayToFilmArray = (
    peliculas: RESTPelicula[]
  ): Pelicula[] => {
    return peliculas.map(this.mapRESTFilmToFilm);
  };

  // static RESTCountry => country

  // static RESTCountry[]=> Country[]
}
