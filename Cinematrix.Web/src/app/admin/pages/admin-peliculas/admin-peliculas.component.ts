import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Pelicula } from '../../interfaces/pelicula.interface';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-peliculas',
  imports: [TitleCasePipe],
  templateUrl: './admin-peliculas.component.html',
  styleUrl: './admin-peliculas.component.css',
})
export class AdminPeliculasComponent {
  router = inject(Router);
  goToEditFilm(id: number) {
    this.router.navigate(['admin/peliculas', id]);
  }

  adminService = inject(AdminService);

  peliculasResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.adminService.getPeliculas();
    },
  });

  goCreateFilm() {
     this.router.navigate(['admin/peliculas/crear']);
  }
}
