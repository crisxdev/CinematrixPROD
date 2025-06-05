import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminPeliculasComponent } from './pages/admin-peliculas/admin-peliculas.component';
import { AdminSesionesComponent } from './pages/admin-sesiones/admin-sesiones.component';

import { AdminEditarPeliculaComponent } from './pages/admin-editar-pelicula/admin-editar-pelicula.component';
import { AdminCrearPeliculaComponent } from './pages/admin-crear-pelicula/admin-crear-pelicula.component';
import { AdminEditarSesionComponent } from './pages/admin-editar-sesion/admin-editar-sesion.component';
import { AdminCrearSesionComponent } from './pages/admin-crear-sesion/admin-crear-sesion.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'peliculas',
        component: AdminPeliculasComponent,
      },
      {
        path: 'peliculas/crear',
        component: AdminCrearPeliculaComponent,
      },
      {
        path: 'peliculas/:id',
        component: AdminEditarPeliculaComponent,
      },

      {
        path: 'sesiones',
        component: AdminSesionesComponent,
      },
       {
        path: 'sesiones/crear',
        component: AdminCrearSesionComponent,
      },

      {
        path: 'sesiones/:id',
        component: AdminEditarSesionComponent,
      },


      { path: '**', redirectTo: 'peliculas' },
    ],
  },
];

export default adminRoutes;
