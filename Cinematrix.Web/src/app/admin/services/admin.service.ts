import { Pelicula } from './../../cartelera/interfaces/pelicula.interface';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, map, tap, throwError } from 'rxjs';
import { PeliculasMapper } from '../mappers/peliculas-mapper';
import { RESTPelicula } from '../interfaces/rest-pelicula.interface';
import { HttpClient } from '@angular/common/http';
import { RESTInfoPelicula } from '../interfaces/rest-info-pelicula';
import { RESTSesiones } from '../interfaces/rest-sesiones.interface';
import { SesionesMapper } from '../mappers/sesiones-mapper';
import { SesionInfoREST } from '../interfaces/sesion-info-rest.interface';
import { PUTsesion } from '../interfaces/put-sesion.interface';

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
    console.log({ id, pelicula });
    return this.http
      .put<RESTInfoPelicula>(`${API_URL}peliculas/${id}`, pelicula)
      .pipe(
        tap((res) => console.log(res)),
        catchError((error) => {
          return throwError(() => new Error('No se pudo obtener la cartelera'));
        })
      );
  }

  eliminarPelicula(id: number) {
    console.log({ id });
    return this.http.delete<RESTInfoPelicula>(`${API_URL}peliculas/${id}`).pipe(
      tap((res) => console.log(res)),
      catchError((error) => {
        return throwError(() => new Error('No se pudo obtener la cartelera'));
      })
    );
  }

  getPeliculaParametersInfo() {
    return this.http.get<RESTInfoPelicula>(`${API_URL}peliculas/info`).pipe(
      map((rest) => PeliculasMapper.mapRESTInfoPeliculaToInfoPelicula(rest)),

      tap((res) => console.log(res)),
      catchError((error) => {
        return throwError(() => new Error('No se pudo obtener la cartelera'));
      })
    );
  }

  postPelicula(pelicula: Pelicula) {
    return this.http
      .post<RESTInfoPelicula>(`${API_URL}peliculas`, pelicula)
      .pipe(
        tap((res) => console.log(res)),
        catchError((error) => {
          return throwError(() => new Error('No se pudo obtener la cartelera'));
        })
      );
  }

  getSesiones(fecha: string | undefined, estado: string | undefined) {
    // ?fecha=${fecha}&&estado=${estado}
    console.log(fecha, estado);
    const fechaSesion = fecha ?? '';
    const estadoSesion = estado ?? '';
    return this.http
      .get<RESTSesiones[]>(
        `${API_URL}sesiones?fecha=${fechaSesion}&&estado=${estadoSesion}`
      )
      .pipe(
        map(SesionesMapper.mapRESTSesionesArrayToSesionesArray),
        tap((res) => console.log(res)),
        catchError((error) => {
          return throwError(() => new Error('No se pudo obtener la cartelera'));
        })
      );
  }

  getSesion(id: number) {
    return this.http.get<SesionInfoREST>(`${API_URL}sesiones/${id}`).pipe(
      map((res) => SesionesMapper.mapRestToSesionInfo(res)),
      tap((res) => console.log(res)),
      catchError((error) => {
        return throwError(() => new Error('No se pudo obtener la cartelera'));
      })
    );
  }

  putSesion(sesionPUT: PUTsesion, id: number) {
    console.log(sesionPUT, id);
    return this.http.put<PUTsesion>(`${API_URL}sesiones/${id}`, sesionPUT).pipe(
      tap((res) => console.log(res)),
      catchError((error) => {
        return throwError(() => new Error('No se pudo obtener la cartelera'));
      })
    );
  }

  getInfoPostSesion() {
    return this.http.get<SesionInfoREST>(`${API_URL}sesiones/info`).pipe(
      tap((res) => console.log(res)),
      map((res) => SesionesMapper.mapRestToSesionInfo(res)),
      catchError((error) => {
        return throwError(() => new Error('No se pudo obtener la cartelera'));
      })
    );
  }

  getSiguienteFechaDisponibleSesion(fecha: string, sala: string) {
    return this.http
      .get<Date>(
        `${API_URL}sesiones/fecha/siguiente?fecha=${fecha}&&sala=${sala}`
      )
      .pipe(
        tap((res) => console.log(res)),
        map((res) => new Date(res)),
        catchError((error) => {
          return throwError(() => new Error('No se pudo obtener la cartelera'));
        })
      );
  }

  crearSesion(sesion: PUTsesion) {
    console.log(sesion);
    return this.http.post<PUTsesion>(`${API_URL}sesiones/crear`, sesion).pipe(
      tap((res) => console.log(res)),
      catchError((error) => {
        return throwError(() => new Error('No se pudo obtener la cartelera'));
      })
    );
  }
}
