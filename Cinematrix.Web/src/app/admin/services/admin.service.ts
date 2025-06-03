import { Pelicula } from './../../cartelera/interfaces/pelicula.interface';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, map, tap, throwError } from 'rxjs';
import { PeliculasMapper } from '../mappers/peliculas-mapper';
import { RESTPelicula } from '../interfaces/rest-pelicula.interface';
import { HttpClient } from '@angular/common/http';
import { RESTInfoPelicula } from '../interfaces/rest-info-pelicula';

const API_URL = 'https://localhost:7243/api/admin/';
@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);

  getPeliculas() {
    return this.http.get<RESTPelicula[]>(`${API_URL}peliculas`).pipe(
      map((rest) => rest.map(PeliculasMapper.mapRESTFilmToFilm)),

      tap((res) => console.log(res)),
      catchError((error) => {
        return throwError(() => new Error('No se pudo obtener la cartelera'));
      })
    );
  }

  getPeliculaInfo(id: number) {
    return this.http.get<RESTInfoPelicula>(`${API_URL}peliculas/${id}`).pipe(
      map((rest) => PeliculasMapper.mapRESTInfoPeliculaToInfoPelicula(rest)),

      tap((res) => console.log(res)),
      catchError((error) => {
        return throwError(() => new Error('No se pudo obtener la cartelera'));
      })
    );
  }

  actualizarPelicula(id: number, pelicula: Pelicula) {

    console.log({id,pelicula});
    return this.http
      .put<RESTInfoPelicula>(`${API_URL}peliculas/${id}`, pelicula)
      .pipe(
        tap((res) => console.log(res)),
        catchError((error) => {
          return throwError(() => new Error('No se pudo obtener la cartelera'));
        })
      );
  }
}
