import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { Detalle } from '../../interfaces/detalle-compra.interface';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CarteleraService } from '../../services/cartelera.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compra-final',
  imports: [TitleCasePipe, CurrencyPipe],
  templateUrl: './compra-final.component.html',
  styleUrl: './compra-final.component.css',
})
export class CompraFinalComponent {




  carteleraService = inject(CarteleraService);
  finalizar = signal<undefined|boolean>(undefined);
  @Output() estado = new EventEmitter<number>();
  errorMessage =  input<string | unknown | null>();
  detalle = input<Detalle>();
  value=signal<undefined|boolean>(undefined)
  error=signal<undefined|boolean>(undefined)
  private router = inject(Router);
  volver() {
    if(this.value() || this.error()){
       this.router.navigate(['cartelera']);
    }
    this.estado.emit(1);
  }



  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['detalle']) {
  //   }
  // }
  finalizarCompraResource = rxResource({
    request: () => ({
      finalizar: this.finalizar(),
    }),
    loader: ({ request }) => {

      if (!request.finalizar) return of(undefined);
      return this.carteleraService.postFinalizarCompra();
    },
  });

    comprar() {
    if(!this.finalizar()){
    this.finalizar.set(true)
    this.finalizarCompraResource.reload()
    }

  }

  comprobarResultado=effect(()=>{
    const error=this.finalizarCompraResource.error();
    const value=this.finalizarCompraResource.value()
    console.log(value,error);



    if(error){
    this.error.set(true)
    }
    if(value){

      this.value.set(true)
    }
  })
}
