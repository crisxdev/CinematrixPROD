import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { CarteleraService } from '../../services/cartelera.service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Tarifas } from '../../interfaces/tarifas-interface';
import { SeleccionEntradasComponent } from '../../components/seleccion-entradas/seleccion-entradas.component';
import { Tarifa } from '../../interfaces/tarifa.interface';
import { CarteleraMapper } from '../../mappers/cartelera.mapper';
import { PostTarifa } from '../../interfaces/rest-tarifa.interface';
import { of } from 'rxjs';
enum TarifasEnum {
  adulto = 'ADULTO',
  familiar = 'FAMILIAR',
  reducida = 'REDUCIDA',
}

@Component({
  selector: 'app-cartelera-sesion-page',
  imports: [SeleccionEntradasComponent],
  templateUrl: './cartelera-sesion-page.component.html',
  styleUrl: './cartelera-sesion-page.component.css',
})
export class CarteleraSesionPageComponent implements OnInit {
  router = inject(Router);
  carteleraService = inject(CarteleraService);
  activatedRoute = inject(ActivatedRoute);

  // tarifas=signal<Tarifas[]>([

  // ])

  tarifas = signal<{ [nombre: string]: Tarifas }>({});

  tarifasSelected = signal<PostTarifa[]|undefined>(undefined);

  id = signal<number | undefined>(undefined);

  carteleraResource = rxResource({
    loader: ({ request }) => {
      return this.carteleraService.getTarifas();
    },
  });

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id.set(Number(params.get('id')));
    });
  }

  tarifasResource = rxResource({
    request: () => ({
      tarifa: this.tarifasSelected(),
      id: this.id(),
    }),

    loader: ({ request }) => {
      console.log(request.tarifa, request.id);
      if ( !request.tarifa || !request.id) return of([]);

      return this.carteleraService.postSelectedTarifas(
        request.tarifa,
        request.id
      );
    },
  });

  constructor() {}

  transformToObject = effect(() => {
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

      this.tarifas.set(tarifaObj);
    }
  });

  sendTarifas(tarifas: { [nombre: string]: Tarifas }) {
    console.log(tarifas);
    const tarifasPost =
      CarteleraMapper.mapTarifasSeleccionadasToRESTTarifasSeleccionadas(
        tarifas
      );
      this.tarifasSelected.set(tarifasPost);

      this.tarifasResource.reload()
  }
}
