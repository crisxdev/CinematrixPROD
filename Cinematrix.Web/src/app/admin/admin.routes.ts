import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminPeliculasComponent } from './pages/admin-peliculas/admin-peliculas.component';
import { AdminSesionesComponent } from './pages/admin-sesiones/admin-sesiones.component';

import { AdminEditarPeliculaComponent } from './pages/admin-editar-pelicula/admin-editar-pelicula.component';


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
        path: 'peliculas/:id',
        component: AdminEditarPeliculaComponent,
      },
      {
        path: 'sesiones',
        component: AdminSesionesComponent,
      },
      { path: '**', redirectTo: 'peliculas' },
    ],
  },
];

export default adminRoutes;
