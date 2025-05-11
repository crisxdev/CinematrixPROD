import { Routes } from '@angular/router';
import { PeliculasPageComponent } from './pages/cartelera-peliculas/peliculas-page.component';
import { CarteleraLayoutComponent } from './layout/cartelera-layout/cartelera-layout.component';

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
        path:'**', //Si no encuentra ninguna ruta hija redirige a la ruta hija peliculas
        redirectTo:'peliculas'
      },
    ],
  },

  // {
  //   path:'country',

  // },
  // {
  //   path:'**',
  //   redirectTo:''

  // },
];

export default countryRoutes;
