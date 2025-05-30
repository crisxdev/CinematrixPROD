import {
  Component,
  inject,
  signal,
  input,
  Output,
  EventEmitter,
  OnInit,
  computed,
  Input,
  effect,
} from '@angular/core';
import { CarteleraService } from '../../services/cartelera.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tarifas } from '../../interfaces/tarifas-interface';
import { CurrencyPipe, NgClass, TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-seleccion-entradas',
  imports: [CurrencyPipe, NgClass, TitleCasePipe],
  templateUrl: './seleccion-entradas.component.html',
  styleUrl: './seleccion-entradas.component.css',
})
export class SeleccionEntradasComponent {
  router = inject(Router);
  carteleraService = inject(CarteleraService);
  activatedRoute = inject(ActivatedRoute);
  totalPrice = signal(0);
  // totalPrice=signal(this.carteleraService.getCacheTarifas()??0)
  tarifasInput = input<{ [nombre: string]: Tarifas }>();

  tarifasLocal = signal<{ [nombre: string]: Tarifas }>({});
  isEmpty = input<boolean | undefined | unknown>();
  isError = input<boolean | undefined | unknown>();
  isLoading = input<boolean | undefined | unknown>();
  @Output() seleccionTarifas = new EventEmitter<{
    [nombre: string]: Tarifas;
  }>();

  amount = signal<number>(0);
  id = signal<number>(0);

  inicializarTarifasLocal = effect(() => {
    const tarifas = this.tarifasInput();
    if (tarifas) {
      this.tarifasLocal.set(structuredClone(this.tarifasInput() ?? {}));
    }
  });

  tarifasArray = computed(() => {
    return Object.keys(this.tarifasLocal());
  });
  onHandleClickLess(name: string) {
    const tarifasState = { ...this.tarifasLocal() };
    let precio;
    let tarifa = { ...tarifasState[name] };
    let total = this.totalPrice();
    if (tarifa.cantidad > 0) {
      tarifa.cantidad--;
      total -= tarifa.precio;
    }

    tarifasState[name] = tarifa;

    this.tarifasLocal.set(tarifasState);
    this.totalPrice.set(total);
    console.log(this.totalPrice());
  }

  onHandleClickAdd(name: string) {
    const tarifasState = { ...this.tarifasLocal() };
    let precio;
    console.log(this.tarifasLocal());
    //Hay que hacer una copia del objeto para que detecte el cambio
    let tarifa = { ...tarifasState[name] };
    let total = this.totalPrice();
    if (tarifa.cantidad < 9) {
      tarifa.cantidad++;
      total += tarifa.precio;
    }

    tarifasState[name] = tarifa;
    console.log(tarifasState);
    this.tarifasLocal.set(tarifasState);
    this.totalPrice.set(total);
    console.log(this.totalPrice());
  }

  onHandleClickNext() {
    // this.carteleraService.setCacheTarifas(this.tarifasLocal());
    // this.carteleraService.setTotalTarifas(this.totalPrice())
    this.seleccionTarifas.emit(this.tarifasLocal());
  }

  getPriceConverted(price: number): number {
    return price / 100;
  }

  volver() {
    this.router.navigate(["/"])
  }
}
