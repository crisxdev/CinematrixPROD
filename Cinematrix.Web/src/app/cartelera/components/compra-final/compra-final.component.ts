import { Component, EventEmitter, input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-compra-final',
  imports: [],
  templateUrl: './compra-final.component.html',
  styleUrl: './compra-final.component.css',
})
export class CompraFinalComponent {
  @Output() estado = new EventEmitter<number>();
  errorMessage = input<string | unknown | null>();
  volver() {
    this.estado.emit(1);
  }
}
