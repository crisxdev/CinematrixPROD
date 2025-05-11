import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path:'',
  //   loadChildren:()=> import('./cartelera/cartelera.routes')
  // },

  {
    path: 'cartelera',
    loadChildren: () => import('./cartelera/cartelera.routes'),
  },

  // {
  //   path:'country',

  // },
  {
    path: '**',
    redirectTo: 'cartelera',
  },
];
