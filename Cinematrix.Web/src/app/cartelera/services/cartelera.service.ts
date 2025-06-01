import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, delay, map, Observable, tap, throwError } from 'rxjs';
import { Pelicula } from '../interfaces/pelicula.interface';
import { RESTPelicula } from '../interfaces/rest-pelicula.interface';
import { CarteleraMapper } from '../mappers/cartelera.mapper';
import { Fechas } from '../interfaces/fechas.interface';
import { ChildActivationEnd } from '@angular/router';
import { Tarifa } from '../interfaces/tarifa.interface';
import { PostTarifa, RESTTarifa } from '../interfaces/rest-tarifa.interface';
import { Tarifas } from '../interfaces/tarifas-interface';
import { Sala } from '../interfaces/rest-sala.interface';
import { LocalStorage } from '../interfaces/local-storage.interface';

const API_URL = 'https://localhost:7243/api/cartelera';

const loadFromLocalStorage = () => {};
@Injectable({
  providedIn: 'root',
})
export class CarteleraService {
  private http = inject(HttpClient);

  private cacheTarifas: { [nombre: string]: Tarifas } | undefined = undefined;
  private totalTarifas = signal(0);

  loadFromLocalStorage(): LocalStorage {
    const seleccionFromLocalStorage = localStorage.getItem('seleccion') ?? '{}';
    const seleccion = JSON.parse(seleccionFromLocalStorage);

    return seleccion;
  }

  saveToLocalStorage(seleccionEntradas: any) {
    localStorage.setItem('seleccion', JSON.stringify(seleccionEntradas));
  }

  setCacheTarifas(tarifas: { [nombre: string]: Tarifas }) {
    this.cacheTarifas = tarifas;
  }

  getCacheTarifas(): { [nombre: string]: Tarifas } | undefined {
    return this.cacheTarifas;
  }

  setTotalTarifas(total: number) {
    this.totalTarifas.set(total);
  }

  getTotalTarifas() {
    return this.totalTarifas();
  }

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

  getTarifas() {
    return this.http.get<RESTTarifa[]>(`${API_URL}/tarifas`).pipe(
      map(CarteleraMapper.mapRESTarifaArrayToTarifaArray),
      delay(200),
      tap((res) => console.log('res:', res)),
      catchError((error) => {
        return throwError(() => new Error('Error al obtener las tarifas'));
      })
    );
  }

  postSelectedTarifas(
    tarifasPost: PostTarifa[],
    sesionId: number,
    existeCompra: boolean
  ) {
    if (existeCompra) {
      const storage = this.loadFromLocalStorage();
      if (storage.idCompra) {
        return this.http
          .post<Sala>(
            `${API_URL}/compra/${sesionId}?idCompra=${storage.idCompra}`,
            tarifasPost
          )
          .pipe(
            tap((res) => {
              let obj = {
                ...storage,
                tarifas: tarifasPost,
                idCompra: res.compraId,



              };
              console.log(obj);
              this.saveToLocalStorage(obj);
            }),
            catchError((error) => {
              return throwError(() => new Error('Error al empezar la compra'));
            })
          );
      }
    }

    return this.http
      .post<Sala>(`${API_URL}/compra/${sesionId}`, tarifasPost)
      .pipe(
        tap((res) => {
          console.log(res);
          let obj = {
            tarifas: tarifasPost,
            idCompra: res.compraId,
            estado:1
          };
          this.saveToLocalStorage(obj);
        }),
        catchError((error) => {
          return throwError(() => new Error('Error al empezar la compra'));
        })
      );
  }

  postFinalSelection(asientosSeleccionados: string[]) {
    const infoLocal = this.loadFromLocalStorage();
    console.log({
      tarifas: infoLocal.tarifas,
      idCompra: infoLocal.idCompra,
      asientosSeleccionados: asientosSeleccionados,
    });
    console.log(`${API_URL}/compra/intermedio/${infoLocal.idCompra}`);
    return this.http
      .post(`${API_URL}/compra/intermedio/${infoLocal.idCompra}`, {
        tarifas: infoLocal.tarifas,
        idCompra: infoLocal.idCompra,
        asientosSeleccionados: asientosSeleccionados,
      })
      .pipe(
        tap((res) => {
          console.log(res);
          this.saveToLocalStorage({
            tarifas: infoLocal.tarifas,
            idCompra: infoLocal.idCompra,
            asientosSeleccionados: asientosSeleccionados,
            estado:2
          });
        }),
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error('Error de reserva'));
        })
      );
  }

  cancelarCompra() {
    const infoLocal = this.loadFromLocalStorage();
    return this.http
      .post(`${API_URL}/compra/cancelar/${infoLocal.idCompra}`, {})
      .pipe(
        tap((res) => {
          console.log(res + 'COMPRA CANCELADAA ');
        }),
        catchError((error) => {
          return throwError(() => new Error('Error al empezar la compra'));
        })
      );
  }
  // getSala(idSesion: number) {
  //   return this.http.get<Sala>(`${API_URL}/compra/${idSesion}`).pipe(
  //     tap((res) => console.log(res)),
  //     catchError((error) => {
  //       return throwError(() => new Error('Error al obtener la sala'));
  //     })
  //   );
  // }

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
