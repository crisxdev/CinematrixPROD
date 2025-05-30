import {
  Component,
  effect,
  EventEmitter,
  input,
  Output,
  signal,
} from '@angular/core';
import { AsientoEstado, Sala } from '../../interfaces/rest-sala.interface';
import { Asiento, Asientos } from '../../interfaces/asientos.interface';

@Component({
  selector: 'app-sala',
  imports: [],
  templateUrl: './sala.component.html',
  styleUrl: './sala.component.css',
})
export class SalaComponent {
  sala = input<Sala | undefined>(undefined);
  salaCopy = signal<string[]>([]);

  @Output() estado = new EventEmitter<number>();

  salaInput = effect(() => {
    const salaKeys = Object.keys(this.sala() ?? {});
    this.salaCopy.set(salaKeys);
  });

  asientos: Asiento[] = [];
  asientosSelected = signal<string[]>([]);

  devuelveKeys() {
    return this.salaCopy();
  }

  devuelveValues(key: string) {
    const keys = this.sala()?.[key] ?? [];
    // console.log(keys);
    let asientos: Asiento[] = [];

    for (let asiento of keys) {
      const clave = Object.keys(asiento)[0];
      const valor = asiento[clave];

      asientos.push({
        nombre: clave,
        estado: valor,
        imagen:
          valor === 'DISPONIBLE'
            ? 'seat_free.svg'
            : valor === 'NO_DISPONIBLE'
            ? ''
            : valor === 'OCUPADO'
            ? 'seat_sold.svg'
            : '',
      });
    }

    // console.log(this.asientos);

    // console.log(asientos);
    return asientos;

    // return this.sala()??[key];
  }

  onSeatClick(asiento: string): boolean {
    const encontarAsiento = this.asientosSelected().filter(
      (el) => el === asiento
    );

    if (encontarAsiento.length > 0) {
      const arrQuitarAsiento = this.asientosSelected().filter(
        (el) => el != asiento
      );
      this.asientosSelected.set(arrQuitarAsiento);
      return false;
    } else {
      const copiaArr = [...this.asientosSelected()];
      copiaArr.push(asiento);
      this.asientosSelected.set(copiaArr);
      return true;
    }
  }

  volver() {
    this.estado.emit(0)
  }
}
