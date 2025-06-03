import { Pelicula } from "./pelicula.interface";

export interface RESTInfoPelicula {
  categorias:     string[];
  calificaciones: string[];
  formatos:       string[];
  pelicula:       Pelicula;
}


