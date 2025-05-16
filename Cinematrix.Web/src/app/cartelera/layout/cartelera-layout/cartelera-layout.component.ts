import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { CarteleraTopMenuComponent } from '../../components/cartelera-top-menu/cartelera-top-menu.component';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-cartelera-layout',
  imports: [RouterOutlet, CarteleraTopMenuComponent, FooterComponent],
  templateUrl: './cartelera-layout.component.html',
  styleUrl: './cartelera-layout.component.css',
})
export class CarteleraLayoutComponent {}
