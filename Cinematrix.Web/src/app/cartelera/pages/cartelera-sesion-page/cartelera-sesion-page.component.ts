import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { CarteleraService } from '../../services/cartelera.service';
import { CurrencyPipe } from '@angular/common';
import {Tarifas} from '../../interfaces/tarifas-interface';
enum TarifasEnum {
  adulto = 'ADULTO',
  familiar = 'FAMILIAR',
  reducida = 'REDUCIDA',
}

@Component({
  selector: 'app-cartelera-sesion-page',
  imports: [CurrencyPipe],
  templateUrl: './cartelera-sesion-page.component.html',
  styleUrl: './cartelera-sesion-page.component.css',
})
export class CarteleraSesionPageComponent implements OnInit {
  router = inject(Router);
  carteleraService = inject(CarteleraService);
  activatedRoute = inject(ActivatedRoute);

  // tarifas=signal<Tarifas[]>([

  // ])

  tarifas = signal<{ [nombre: string]:Tarifas}>({});

  amount = signal<number>(0);

  id = signal<number>(0);

  carteleraResource = rxResource({
    loader: ({ request }) => {
      return this.carteleraService.getTarifas();
    },
  });

  tarifasArray=computed(()=>{
    return Object.keys(this.tarifas())
  })
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id.set(Number(params.get('id')));
      console.log(this.id());
    });





  }

  constructor(){
     effect(() => {
      if (this.carteleraResource.hasValue()) {
        const tarifaData = this.carteleraResource.value();
        const tarifaObj: { [nombre: string]: Tarifas } = {};

        for (let tarifa of tarifaData) {
          tarifaObj[tarifa.nombre] = {
            nombre: tarifa.nombre,
            precio: tarifa.precio,
            cantidad: 0,
          };
        }

        this.tarifas.set(tarifaObj);
      }
    });
  }

  onHandleClickLess(name: string) {
    const tarifasState ={... this.tarifas()};
    let precio;
    let tarifa = {...tarifasState[name]};

    if (tarifa.cantidad > 0) {
      tarifa.cantidad--;
    }
  
    tarifasState[name]=tarifa
    this.tarifas.set(tarifasState);
  }

  onHandleClickAdd(name: string) {
     const tarifasState ={... this.tarifas()};
    let precio;
    let tarifa = {...tarifasState[name]};

    if (tarifa.cantidad < 9) {
      tarifa.cantidad++;
    }


    tarifasState[name]=tarifa
    this.tarifas.set(tarifasState);
  }

  // this.tarifas.set(tarifasState);

  // if(this.amount()>0){
  //   this.amount.update((amount)=>amount-1)
  // }
}
