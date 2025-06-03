import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './auth/guards/not-authenticated.guard';
import { IsAuthenticatedGuard } from './auth/guards/authenticated.guard';

export const routes: Routes = [

  {
    path:'auth',
    loadChildren:()=>import('./auth/auth.routes'),
    canMatch:[
      NotAuthenticatedGuard
    ]
  },
  // {
  //   path:'',
  //   loadChildren:()=> import('./cartelera/cartelera.routes')
  // },

  {
    path: 'cartelera',
    loadChildren: () => import('./cartelera/cartelera.routes'),
  },
  {
    path:'admin',
    loadChildren:()=>import('./admin/admin.routes'),
    canMatch:[
      IsAuthenticatedGuard
    ]
  },

  // {
  //   path:'country',

  // },
  {
    path: '**',
    redirectTo: 'cartelera',
  },
];
