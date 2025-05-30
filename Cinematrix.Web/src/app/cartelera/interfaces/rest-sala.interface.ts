export interface Sala {
  [fila: string]: AsientoEstado[];
}

export interface AsientoEstado {
  [asientoNumero: string]: EstadoAsiento;
}

export type EstadoAsiento = "DISPONIBLE" | "OCUPADO" | "NO_DISPONIBLE";
