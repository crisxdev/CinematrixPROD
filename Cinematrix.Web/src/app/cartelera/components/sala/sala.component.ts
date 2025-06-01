import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  AsientoEstado,
  Sala,
  EstadoAsiento,
} from '../../interfaces/rest-sala.interface';
import { Asiento, Asientos } from '../../interfaces/asientos.interface';
import { CarteleraService } from '../../services/cartelera.service';

@Component({
  selector: 'app-sala',
  imports: [],
  templateUrl: './sala.component.html',
  styleUrl: './sala.component.css',
})
export class SalaComponent implements OnChanges {
  sala = input<Sala | undefined>(undefined);
  salaCopy = signal<string[]>([]);

  errorMessage = input<string | unknown | null>();

  cantidadEntradas = input<number>(0);
  carteleraService = inject(CarteleraService);
  ngOnChanges(changes: SimpleChanges) {
    if (changes['sala']) {
      console.log('CHANGEES');
      const salaKeys = Object.keys(this.sala()?.asientos ?? {});
      this.salaCopy.set(salaKeys);
      this.devuelveKeys();
      const localInfo = this.carteleraService.loadFromLocalStorage().asientosSeleccionados;
      // console.log(localInfo);
      this.asientosSelected.set( localInfo?? []);
    }
  }

  @Output() estado = new EventEmitter<number>();
  @Output() asientosSeleccionadosOutput = new EventEmitter<string[]>();

  salaInput = effect(() => {});

  asientos: Asiento[] = [];
  asientosSelected = signal<string[]>([]);

  devuelveKeys() {
    return this.salaCopy();
  }

  devuelveValues(key: string) {
    // console.log(key);
    // console.log(this.sala()?.asientos);
    // const keys = this.sala()?.[key] ?? [];
    const keys = this.sala()?.asientos[key] ?? [];
    // console.log(keys);
    let asientos: Asiento[] = [];
    // console.log('SELECTED', this.asientosSelected());

    for (let asiento of keys) {
      const clave = Object.keys(asiento)[0];
      const valor = asiento[clave];

      // const estaSeleccionada=this.asientosSelected().includes(this.carteleraService.loadFromLocalStorage().seleccionAsientos)
      const infoLocal=this.carteleraService.loadFromLocalStorage()
      asientos.push({
        nombre: clave,
        estado: infoLocal.asientosSeleccionados?.includes(clave)?'DISPONIBLE':valor,
        imagen:
        infoLocal.asientosSeleccionados?.includes(clave)?'seat_select.svg':
          valor === 'DISPONIBLE'
            ? 'seat_free.svg'
            : valor === 'NO_DISPONIBLE'
            ? ''
            : valor === 'OCUPADO'
            ? 'seat_sold.svg'
            : '',
      });
    }

    // console.log(asientos);
    return asientos;
  }

  onSeatClick(asiento: string, estado: string): void {
    if (estado === 'OCUPADO' && !this.asientosSelected().includes(asiento) || estado === '') return;

    const encontarAsiento = this.asientosSelected().filter(
      (el) => el === asiento
    );




    if (encontarAsiento.length > 0) {
      const arrQuitarAsiento = this.asientosSelected().filter(
        (el) => el != asiento
      );
      this.asientosSelected.set(arrQuitarAsiento);
    } else {
      if (encontarAsiento)
        if (this.asientosSelected().length >= this.cantidadEntradas()) return;
      const copiaArr = [...this.asientosSelected()];
      copiaArr.push(asiento);
      this.asientosSelected.set(copiaArr);
    }
  }

  volver() {
    this.estado.emit(0);
  }

  nextStep() {
    console.log(this.asientosSelected());
    this.asientosSeleccionadosOutput.emit(this.asientosSelected());
  }
}
