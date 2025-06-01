import { PostTarifa } from "./rest-tarifa.interface";
import { Tarifa } from "./tarifa.interface";

export interface LocalStorage{
  tarifas:PostTarifa[]|undefined, //Tarifa[]
  idCompra:string|undefined,
  asientosSeleccionados:string[]|undefined
  estado:number|undefined
}
