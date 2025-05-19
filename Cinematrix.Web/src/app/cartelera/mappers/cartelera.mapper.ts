import { Fechas } from '../interfaces/fechas.interface';
import { Pelicula, Sesion } from '../interfaces/pelicula.interface';
import { FechasREST } from '../interfaces/rest-fecha.interface';
import {
  RESTPelicula,
  RESTSesion,
} from '../interfaces/rest-pelicula.interface';
import { PostTarifa, RESTTarifa } from '../interfaces/rest-tarifa.interface';
import { Tarifa } from '../interfaces/tarifa.interface';
import { Tarifas } from '../interfaces/tarifas-interface';

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

  static mapRESTfechasToFechas=(fechas:FechasREST):Fechas=>{
    return {
      listaFechas:fechas.listaFechas
    }
  }

  static mapRESTTarifaToTarifa=(tarifa:RESTTarifa):Tarifa=>{

    return{
      nombre:tarifa.nombre,
      precio:tarifa.precio
    }

  }

  static mapRESTarifaArrayToTarifaArray=(tarifas:RESTTarifa[]):Tarifa[]=>{

    return tarifas.map(this.mapRESTTarifaToTarifa);

  }

  static mapTarifasSeleccionadasToRESTTarifasSeleccionadas=(tarifaObj: { [nombre: string]: Tarifas }):PostTarifa[]=>{
    let arrTarifas=[]
    for (let value of Object.values(tarifaObj)){
        arrTarifas.push({
          nombre:value.nombre,
          cantidad:value.cantidad
        })
    }
    return arrTarifas;
  }
  // static RESTCountry => country

  // static RESTCountry[]=> Country[]
}
