import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import { Pelicula } from '../interfaces/pelicula.interface';
import { RESTPelicula } from '../interfaces/rest-pelicula.interface';
import { CarteleraMapper } from '../mappers/cartelera.mapper';

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

  searchCartelera() {
    return this.http.get<RESTPelicula[]>(`${API_URL}`).pipe(
      map(CarteleraMapper.mapRESTfilmArrayToFilmArray),
      delay(2000),

      catchError((error)=>{
        return throwError(()=>new Error("No se pudo obtener la cartelera"))
      })
    );


  }
}
