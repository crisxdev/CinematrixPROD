export interface Asientos {
  asientos:Asiento[]
  idCompra:string;
}

export interface Asiento {
  nombre: string;
  estado: string;
  imagen:string;
}
