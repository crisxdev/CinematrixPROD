import { RESTSesiones } from '../interfaces/rest-sesiones.interface';
import { SesionInfoREST } from '../interfaces/sesion-info-rest.interface';
import { SesionInfo } from '../interfaces/sesion-info.interface';
import { Sesiones } from '../interfaces/sesiones.interface';

export class SesionesMapper {
  static mapRESTSesionesToSesiones = (sesion: RESTSesiones): Sesiones => {
    return {
      pelicula: sesion.pelicula,
      sala: sesion.sala,
      estado: sesion.estado,
      inicio: sesion.inicio,
      fin: sesion.fin,
      id: sesion.id,
    };
  };

  static mapRESTSesionesArrayToSesionesArray = (
    restSesiones: RESTSesiones[]
  ): Sesiones[] => {
    return restSesiones.map(this.mapRESTSesionesToSesiones);
  };

  static mapRestToSesionInfo(rest: SesionInfoREST): SesionInfo {
    return {
      peliculas: rest.peliculas,
      salas: rest.salas,
      sesion: rest.sesion  ? {
          ...rest.sesion,
          inicio: rest.sesion.inicio ,
          fin: rest.sesion.fin
        }
      : undefined,
    };
  }


}
