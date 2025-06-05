import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { CarteleraService } from '../../services/cartelera.service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Tarifas } from '../../interfaces/tarifas-interface';
import { SeleccionEntradasComponent } from '../../components/seleccion-entradas/seleccion-entradas.component';
import { Tarifa } from '../../interfaces/tarifa.interface';
import { CarteleraMapper } from '../../mappers/cartelera.mapper';
import { PostTarifa } from '../../interfaces/rest-tarifa.interface';
import { filter, map, of } from 'rxjs';
import { Sala } from '../../interfaces/rest-sala.interface';
import { SalaComponent } from '../../components/sala/sala.component';
import { CompraFinalComponent } from '../../components/compra-final/compra-final.component';
import { LocalStorage } from '../../interfaces/local-storage.interface';
import { Detalle } from '../../interfaces/detalle-compra.interface';
enum TarifasEnum {
  adulto = 'ADULTO',
  familiar = 'FAMILIAR',
  reducida = 'REDUCIDA',
}

@Component({
  selector: 'app-cartelera-sesion-page',
  imports: [SeleccionEntradasComponent, SalaComponent, CompraFinalComponent],
  templateUrl: './cartelera-sesion-page.component.html',
  styleUrl: './cartelera-sesion-page.component.css',
})
export class CarteleraSesionPageComponent implements OnInit {
  router = inject(Router);
  carteleraService = inject(CarteleraService);
  activatedRoute = inject(ActivatedRoute);

  sala = signal<Sala | undefined>(undefined);
  // tarifas=signal<Tarifas[]>([

  // ])

  cancelarCompra = signal<undefined | boolean>(undefined);
  cantidadEntradas = signal(0);

  tarifas = signal<{ [nombre: string]: Tarifas }>({});
  existeCompra = signal<boolean>(false);

  tarifasSelected = signal<PostTarifa[] | undefined>(undefined);

  asientosSelected = signal<string[] | undefined>(undefined);

  id = signal<number | undefined>(undefined);

  estadoProceso = signal<number>(0);

  carteleraResource = rxResource({
    loader: ({ request }) => {
      return this.carteleraService.getTarifas();
    },
  });

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id.set(Number(params.get('id')));
    });
    // const nav = performance.getEntriesByType(
    //   'navigation'
    // )[0] as PerformanceNavigationTiming;
    // const fueRecarga = nav?.type === 'reload';

    // if(fueRecarga){

    // }
    const infoLocal = this.carteleraService.loadFromLocalStorage();

    if (infoLocal.estado) {
      if (infoLocal.estado == 1) {
        if (infoLocal.tarifas && infoLocal.idCompra) {
          this.asientosSelected.set(
            structuredClone(infoLocal.asientosSeleccionados)
          );
          console.log(this.asientosSelected());
          this.tarifasSelected.set(infoLocal.tarifas);
          console.log(infoLocal.asientosSeleccionados);
          let cantidadEntradas = 0;

          for (let tarifa of this.tarifasSelected() ?? []) {
            cantidadEntradas += tarifa.cantidad;
          }
          this.cantidadEntradas.set(cantidadEntradas);
          this.estadoProceso.set(1);
          this.existeCompra.set(true);
          this.ocupacionResource.reload();
        }
      } else {
        if (infoLocal.estado == 2) {
          if (
            infoLocal.asientosSeleccionados &&
            infoLocal.idCompra &&
            infoLocal.tarifas
          ) {
            this.asientosSelected.set(
              structuredClone(infoLocal.asientosSeleccionados)
            );
            console.log(this.asientosSelected());
            this.existeCompra.set(true);
            this.estadoProceso.set(2);
            this.tarifasSelected.set(infoLocal.tarifas);

            let cantidadEntradas = 0;

            for (let tarifa of this.tarifasSelected() ?? []) {
              cantidadEntradas += tarifa.cantidad;
            }
            this.cantidadEntradas.set(cantidadEntradas);

            // this.ocupacionResource.reload();
          }
        }
      }
      // this.asientosSelected.set(
      //   structuredClone(infoLocal.asientosSeleccionados)
      // );

      // this.tarifasSelected.set(infoLocal.tarifas);
      // console.log(infoLocal.asientosSeleccionados);
      // let cantidadEntradas = 0;

      // for (let tarifa of this.tarifasSelected() ?? []) {
      //   cantidadEntradas += tarifa.cantidad;
      // }
      // this.cantidadEntradas.set(cantidadEntradas);
      // this.estadoProceso.set(2);
      // this.existeCompra.set(true);
      // this.ocupacionResource.reload();
    }
    // if (
    //   infoLocal.asientosSeleccionados &&
    //   infoLocal.idCompra &&
    //   infoLocal.tarifas &&
    //   infoLocal.estado
    // ) {

    //     this.asientosSelected.set(
    //       structuredClone(infoLocal.asientosSeleccionados)
    //     );

    //     this.tarifasSelected.set(infoLocal.tarifas);
    //     console.log(infoLocal.asientosSeleccionados);
    //     let cantidadEntradas = 0;

    //     for (let tarifa of this.tarifasSelected() ?? []) {
    //       cantidadEntradas += tarifa.cantidad;
    //     }
    //     this.cantidadEntradas.set(cantidadEntradas);
    //     this.estadoProceso.set(2);
    //     this.existeCompra.set(true);
    //     this.ocupacionResource.reload();
    //   }
  }

  tarifasResource = rxResource({
    request: () => ({
      tarifa: this.tarifasSelected(),
      id: this.id(),
      existeCompra: this.existeCompra(),
    }),

    loader: ({ request }) => {
      console.log(request.tarifa, request.id);
      console.log('Holaa');
      if (!request.tarifa || !request.id) {
        this.estadoProceso.set(0);

        return of(undefined);
      }
      if (this.estadoProceso() === 0 || this.estadoProceso() === 1) {
        return this.carteleraService
          .postSelectedTarifas(request.tarifa, request.id, this.existeCompra())
          .pipe(map((sala) => structuredClone(sala)));
      }
      return of(undefined);
    },
  });

  yaTieneValor = signal(false);
  resultadoTarifas = effect(() => {
    const value = this.tarifasResource.value();
    // if (value) {
    //   if (this.estadoProceso() === 0) {
    //     this.estadoProceso.set(1);
    //   } else {
    //     if (this.estadoProceso() === 1) this.estadoProceso.set(0);
    //   }
    // }

    console.log(value);
    if (value) {
      this.estadoProceso.set(1);
    }
  });

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationStart => event instanceof NavigationStart
        )
      )
      .subscribe((event) => {
        const urlDestino = event.url;

        if (!urlDestino.includes('cartelera/sesion')) {
          const seleccionFromLocalStorage =
            this.carteleraService.loadFromLocalStorage();
          if (this.estadoProceso() !== 3 && seleccionFromLocalStorage) {
            navigator.sendBeacon(
              `https://localhost:7243/api/cartelera/compra/cancelar/${seleccionFromLocalStorage.idCompra}`
            );
          }
          localStorage.removeItem('seleccion');
        }
      });

    window.addEventListener('beforeunload', () => {
      const seleccionFromLocalStorage =
        this.carteleraService.loadFromLocalStorage();
      const nav = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (seleccionFromLocalStorage.idCompra) {
        if (nav?.type !== 'reload') {
          if (this.estadoProceso() !== 3) {
            navigator.sendBeacon(
              `https://localhost:7243/api/cartelera/compra/cancelar/${seleccionFromLocalStorage.idCompra}`
            );
          }
          localStorage.removeItem('seleccion');
        }
      }
    });
  }

  transformarAObjeto = effect(() => {
    // Transforma la informacion a un array de objetos {"adulto":{cantidad:0, precio:15}} una vez el servicio tiene valor

    if (this.carteleraResource.hasValue()) {
      const tarifaData = this.carteleraResource.value();
      const tarifaObj: { [nombre: string]: Tarifas } = {};

      for (let tarifa of tarifaData) {
        tarifaObj[tarifa.nombre] = {
          nombre: tarifa.nombre,
          precio: tarifa.precio * 100,
          cantidad: 0,
        };
      }
      console.log(this.carteleraService.getTotalTarifas());
      // this.carteleraService.setTotalTarifas(0);
      this.tarifas.set(tarifaObj);

      // this.carteleraService.setCacheTarifas(tarifaObj);
    }
  });

  sendTarifas(tarifas: { [nombre: string]: Tarifas }) {
    console.log(tarifas);
    const tarifasPost =
      CarteleraMapper.mapTarifasSeleccionadasToRESTTarifasSeleccionadas(
        tarifas
      );
    console.log(tarifasPost);
    this.tarifasSelected.set(structuredClone(tarifasPost));
    this.existeCompra.set(false);
    let cantidadEntradas = 0;

    for (let tarifa of this.tarifasSelected() ?? []) {
      cantidadEntradas += tarifa.cantidad;
    }
    console.log(cantidadEntradas);
    this.cantidadEntradas.set(cantidadEntradas);
    this.tarifasResource.reload();
    // this.carteleraService.saveToLocalStorage(this.tarifasSelected())

    // this.estadoProceso.set(1);
    // this.salaResource.reload()
  }

  volverATarifas(estado: number) {
    // const tarifasCache = this.carteleraService.getCacheTarifas();
    // const tarifasCacheCopia = structuredClone(tarifasCache);
    // console.log(tarifasCache);
    // this.tarifas.set(tarifasCacheCopia ?? {});
    const infoLocal = this.carteleraService.loadFromLocalStorage();
    if (infoLocal) {
      infoLocal.estado = 0;
    }
    this.carteleraService.saveToLocalStorage(infoLocal);
    // localStorage.setItem('seleccion',)
    this.cancelarCompra.set(true);
    this.cancelarResource.reload();
    this.estadoProceso.set(0);
    // this.cancelarCompra.set(undefined)
    // this.cancelarCompra.set(false)
  }

  ocupacionResource = rxResource({
    request: () => ({
      asientos: this.asientosSelected(),
    }),

    loader: ({ request }) => {
      //  console.log(request.tarifa, request.id);
      if (!request.asientos) {
        return of(undefined);
      }

      return this.carteleraService.postFinalSelection(request.asientos);
    },
  });

  cancelarResource = rxResource({
    request: () => ({
      cancelar: this.cancelarCompra(),
    }),

    loader: ({ request }) => {
      if (!request.cancelar) return of();
      return this.carteleraService.cancelarCompra();
    },
  });

  getDetalle=signal<boolean|undefined>(undefined)
  getDetalleResource=rxResource({
    request: () => ({
      getDetalle: this.getDetalle(),
    }),

    loader: ({ request }) => {
      if (!request.getDetalle) return of();
      return this.carteleraService.getDetalleCompra();
    },
  });

  detalle=signal<Detalle|undefined>(undefined)

  getDetalleEffect=effect(()=>{
    const value=this.ocupacionResource.hasValue();
    if(value){
      this.getDetalle.set(true)
      // this.detalle.set(this.ocupacionResource.value())

    }

  })

  enviarSeleccionFinal(asientosSelected: string[]) {
    console.log(asientosSelected);
    this.estadoProceso.set(2);
    this.asientosSelected.set(asientosSelected);
    this.ocupacionResource.reload();
    setTimeout(()=>{
      this.getDetalleResource.reload()
    },100)

  }

  volverASala(estado: number) {
    const infoLocal = this.carteleraService.loadFromLocalStorage();
    if (infoLocal) {
      infoLocal.estado = 1;
    }
    this.carteleraService.saveToLocalStorage(infoLocal);
    console.log(estado);
    this.estadoProceso.set(estado);
    this.existeCompra.set(true);
    this.tarifasResource.reload();
  }
}
