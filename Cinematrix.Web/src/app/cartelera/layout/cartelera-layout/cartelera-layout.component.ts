import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { CarteleraTopMenuComponent } from '../../components/cartelera-top-menu/cartelera-top-menu.component';

@Component({
  selector: 'app-cartelera-layout',
  imports: [RouterOutlet, CarteleraTopMenuComponent],
  templateUrl: './cartelera-layout.component.html',
  styleUrl: './cartelera-layout.component.css',
})
export class CarteleraLayoutComponent {}
