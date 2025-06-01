import { Tarifa } from "./tarifa.interface";

export interface LocalStorage{
  tarifas:Tarifa[]|undefined,
  idCompra:string|undefined,
  asientosSeleccionados:string[]|undefined
}
