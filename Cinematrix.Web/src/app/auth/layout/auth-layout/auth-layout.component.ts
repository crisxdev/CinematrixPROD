import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CarteleraTopMenuComponent } from "../../../cartelera/components/cartelera-top-menu/cartelera-top-menu.component";

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, CarteleraTopMenuComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {



}
