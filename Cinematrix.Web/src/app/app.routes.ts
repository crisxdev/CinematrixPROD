import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path:'auth',
    loadChildren:()=>import('./auth/auth.routes')
  },
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
