import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, map, Observable, tap, throwError } from 'rxjs';
import { Pelicula } from '../interfaces/pelicula.interface';
import { RESTPelicula } from '../interfaces/rest-pelicula.interface';
import { CarteleraMapper } from '../mappers/cartelera.mapper';
import { Fechas } from '../interfaces/fechas.interface';
import { ChildActivationEnd } from '@angular/router';
import { Tarifa } from '../interfaces/tarifa.interface';
import { PostTarifa, RESTTarifa } from '../interfaces/rest-tarifa.interface';
import { Tarifas } from '../interfaces/tarifas-interface';

const API_URL = 'https://localhost:7243/api/cartelera';
@Injectable({
  providedIn: 'root',
})
export class CarteleraService {
  private http = inject(HttpClient);

  //  searchCartelera():Observable<Pelicula[]>{

  //   let respuesta=this.http.get<RESTPelicula[]>(`${API_URL}`)

  //   console.log(respuesta)
  //  }

  searchCartelera(fechaIso?: string) {

    if (fechaIso) {
      return this.http.get<RESTPelicula[]>(`${API_URL}?dia=${fechaIso}`).pipe(
        map(CarteleraMapper.mapRESTfilmArrayToFilmArray),
        delay(200),
        catchError((error) => {
          return throwError(() => new Error('No se pudo obtener la cartelera'));
        })
      );
    }

    return this.http.get<RESTPelicula[]>(`${API_URL}`).pipe(
      map(CarteleraMapper.mapRESTfilmArrayToFilmArray),
      delay(200),
      tap((res) => console.log(res)),
      catchError((error) => {
        return throwError(() => new Error('No se pudo obtener la cartelera'));
      })
    );
  }

  getDates(fecha: number) {
    return this.http.get<Fechas>(`${API_URL}/fechas?cantidad=${fecha}`).pipe(
      map(CarteleraMapper.mapRESTfechasToFechas),
      catchError((error) => {
        return throwError(() => new Error('No se pudo obtener los días'));
      })
    );
  }

  getTarifas(){

    return this.http.get<RESTTarifa[]>(`${API_URL}/tarifas`).pipe(
       map(CarteleraMapper.mapRESTarifaArrayToTarifaArray),
       delay(200),
      tap((res)=>console.log('res:',res)),
      catchError((error)=>{
        return throwError(()=>new Error('Error al obtener las tarifas'))
      })
    )
  }


  postSelectedTarifas(tarifasPost:PostTarifa[], sesionId:number){
    return this.http.post(`${API_URL}/compra/${sesionId}`,tarifasPost).pipe(
      catchError((error)=>{
        return throwError(()=>new Error('Error al empezar la compra'))
      })
    )

  }


  // getByDate(fecha: string) {
  //   return this.http
  //     .get<Fechas>(`${API_URL}/cartelera?dia=${fecha}`)
  //     .pipe(
  //        map(CarteleraMapper.mapRESTfechasToFechas),
  //       catchError((error) => {
  //         return throwError(() => new Error('No se pudo obtener los días'));
  //       })
  //     );
  // }
}
