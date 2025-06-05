import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  NgModule,
  Output,
  signal,
} from '@angular/core';
import { Pelicula } from '../../interfaces/pelicula.interface';
import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
// import { DatePickerModule } from 'primeng/datepicker';
import { CarteleraService } from '../../services/cartelera.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Fechas } from '../../interfaces/fechas.interface';
import { environment } from '../../../../environment.development';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-peliculas',

  imports: [NgClass, DatePipe, ReactiveFormsModule, NgStyle],
  providers: [DatePipe],
  templateUrl: './lista-peliculas.component.html',
  styleUrl: './lista-peliculas.component.css',
})
export class ListaPeliculasComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  @Output() dia = new EventEmitter<string>();
  datePipe = inject(DatePipe);

  form: FormGroup = this.fb.group({
    fecha: [null],
  });

  carteleraService = inject(CarteleraService);
  cantidadFechas = 7;

  dateSelected: Date | null = new Date();

  films = input<Pelicula[]>();
  errorMessage = input<string | unknown | null>();
  isLoading = input<boolean>(false);
  isEmpty = input<boolean>(false);
  hovering = signal<boolean>(false);
  isOver = signal<boolean>(false);
  idFilmSelected = signal(-1);

  carteleraResource = rxResource({
    loader: () => {
      return this.carteleraService.getDates(this.cantidadFechas);
    },
  });

  trailer = signal<SafeResourceUrl>('');
  valueResource = this.carteleraResource.value();

  isOpenModal = signal(false);

  constructor(private sanitizer: DomSanitizer) {
    effect(() => {
      const data = this.carteleraResource.value();
      const dates = data?.listaFechas ?? [];

      if (dates.length > 0 && !this.form.value.fecha) {
        this.form.patchValue({ fecha: dates[0] });
      }
      console.log(this.films());
    });
  }

  onMouseLeaveFilm() {
    this.hovering.set(false);
    // this.isOver.set(false)
    this.idFilmSelected.set(-1);
    console.log(this.idFilmSelected());
    console.log(this.idFilmSelected());
  }

  onMouseOverFilm(event: MouseEvent, id: number) {
    this.hovering.set(true);
    event.stopPropagation();
    this.idFilmSelected.set(id);
  }

  transformDate(fecha: Date) {
    const sesion = new Date(fecha);
    const hour = sesion.getHours().toString().padStart(2, '0');
    const minutes = sesion.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minutes}`;
  }

  onSubmit() {
    const selection = this.form.value.fecha;
    console.log(selection);
    this.dateSelected = selection;
    const fechaObj = new Date(this.dateSelected ?? '');

    const fecha = this.datePipe.transform(fechaObj ?? '', 'yyyy-MM-ddTHH:mm');
    this.dia.emit(fecha ?? undefined);


  }

  getImagenUrl(nombre: string) {
    return `${environment.baseUrlImages}${nombre}`;
  }

  onHandleClickTrailer(trailerURL: string) {
    // if(!this.hovering()) return

    this.isOpenModal.set(true);
    const urlSanitizada =
      this.sanitizer.bypassSecurityTrustResourceUrl(trailerURL);
    this.trailer.set(urlSanitizada);
  }

  onHandleClickSession(id: number) {
    // if(!this.hovering()) return
    this.router.navigate(['cartelera/sesion', id]);
  }
}
