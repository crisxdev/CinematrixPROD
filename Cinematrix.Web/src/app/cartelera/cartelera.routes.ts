import { Routes } from '@angular/router';
import { PeliculasPageComponent } from './pages/cartelera-peliculas/peliculas-page.component';
import { CarteleraLayoutComponent } from './layout/cartelera-layout/cartelera-layout.component';
import { CarteleraSesionPageComponent } from './pages/cartelera-sesion-page/cartelera-sesion-page.component';


export const countryRoutes: Routes = [
  {
    path: '',
    component: CarteleraLayoutComponent,
    children: [
      {
        path: 'peliculas',
        component: PeliculasPageComponent,
      },
      {
        path: '',
        component: PeliculasPageComponent,
      },

        {
        path: 'sesion/:id',
        component: CarteleraSesionPageComponent,
      },
      {
        path: '**', //Si no encuentra ninguna ruta hija redirige a la ruta hija peliculas
        redirectTo: 'peliculas',
      },
    ],
  },
];

export default countryRoutes;
