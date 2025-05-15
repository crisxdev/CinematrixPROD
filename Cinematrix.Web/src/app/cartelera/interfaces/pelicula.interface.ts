
export interface Pelicula{
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
  sesiones:     Sesion[];
}

export interface Sesion {
  id:     number;
  inicio: Date;
  salaId: number;
}
