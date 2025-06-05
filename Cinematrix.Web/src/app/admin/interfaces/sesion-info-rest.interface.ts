export interface SesionInfoREST {
  peliculas: Pelicula[];
  salas:     Sala[];
  sesion:    Sesion|undefined;
}

export interface Pelicula {
  id:     number;
  titulo: string;
}

export interface Sala {
  id:     number;
  nombre: string;
}

export interface Sesion {
  pelicula: string;
  sala:     string;
  id:       number;
  inicio:   Date;
  fin:      Date;
  estado:   string;
}
