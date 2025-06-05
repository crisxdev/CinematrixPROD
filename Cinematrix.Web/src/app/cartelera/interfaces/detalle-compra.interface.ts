export interface Detalle {
  fecha:    Date;
  sala:     string;
  tarifas:  Tarifa[];
  total:    number;
  pelicula: string;
  butacas:string[]
}

export interface Tarifa {
  nombre:   string;
  cantidad: number;
}
