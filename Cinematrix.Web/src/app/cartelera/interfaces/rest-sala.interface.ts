export interface Sala {
  asientos: { [fila: string]: AsientoEstado[] };
  compraId: string;
}

export interface AsientoEstado {
  [asientoNumero: string]: EstadoAsiento;
}

export type EstadoAsiento = 'DISPONIBLE' | 'OCUPADO' | 'NO_DISPONIBLE';
