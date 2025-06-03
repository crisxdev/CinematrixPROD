
export interface RESTPelicula {
  id:           number;
  titulo:       string;
  anio:         number;
  calificacion: string;
  categoria:    string;
  duracion:     number;
  formato:      string;
  imagen:       string;
  poster:       string;
  sinopsis:     string;
  trailer:      string;
  sesiones:     [];
}
