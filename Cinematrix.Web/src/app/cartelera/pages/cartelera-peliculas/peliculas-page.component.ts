import { Component, inject, OnInit } from '@angular/core';
import { CarteleraService } from '../../services/cartelera.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ListaPeliculasComponent } from '../../components/lista-peliculas/lista-peliculas.component';
import { Poster } from '../../interfaces/poster.interface';
import { NgClass } from '@angular/common';
import { PostersComponent } from "../../components/posters/posters.component";
@Component({
  selector: 'app-cartelera-peliculas',
  imports: [ListaPeliculasComponent,  PostersComponent],
  templateUrl: './peliculas-page.component.html',
  styleUrl: './peliculas-page.component.css',
})
export class PeliculasPageComponent {
  carteleraService = inject(CarteleraService);

  // result=this.carteleraService.searchCartelera().subscribe(res=>console.log(res));
  urlBase: string = './img/posters/poster-';
  platform:string='Unsplash';

  posters: Poster[] = [
    {
      url: `${this.urlBase}1.jpg`,
      autor: 'Krists Luhaers',
    },
    {
      url: `${this.urlBase}2.jpg`,
      autor: 'Corina Rainer',
    },
    {
      url: `${this.urlBase}3.jpg`,
      autor: 'GR Stocks',
    },
    {
      url: `${this.urlBase}4.jpg`,
      autor: 'Andrijana Bozic',
    },
  ];


  carteleraResource = rxResource({
    loader: () => {
      return this.carteleraService.searchCartelera();
    },
  });
}
