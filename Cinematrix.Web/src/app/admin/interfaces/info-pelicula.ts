import { Pelicula } from "./pelicula.interface";

export interface InfoPelicula {
  categorias: string[];
  calificaciones: string[];
  formatos: string[];
  pelicula: Pelicula;
}
