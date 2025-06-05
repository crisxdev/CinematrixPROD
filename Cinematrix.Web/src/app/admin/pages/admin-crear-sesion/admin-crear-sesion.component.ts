import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { PUTsesion } from '../../interfaces/put-sesion.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-admin-crear-sesion',
  imports: [TitleCasePipe, DatePipe, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './admin-crear-sesion.component.html',
  styleUrl: './admin-crear-sesion.component.css',
})
export class AdminCrearSesionComponent {
  datePipe = inject(DatePipe);
  goBack() {
    this.router.navigate(['admin/sesiones']);
  }

  infoPutSesion = signal<undefined | PUTsesion>(undefined);

  estadoSesiones = signal<string[]>(['PROGRAMADA']);

  eliminar = signal<boolean | undefined>(undefined);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  adminService = inject(AdminService);
  fb = inject(FormBuilder);
  form!: FormGroup;
  fechaBuscar = signal<undefined | Date>(undefined);
  sala = signal<string | undefined>(undefined);
  fechaSiguiente = signal<Date | undefined>(undefined);

  getInfoSesionPostResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.adminService.getInfoPostSesion();
    },
  });

  // Resource=rxResource({
  //   request: () => ({
  //     id: this.idSesion(),
  //     infoSesion:this.infoPutSesion()
  //   }),
  //   loader: ({ request }) => {
  //     if (!request.id || !request.infoSesion) return of(undefined);

  //     return this.adminService.putSesion(request.infoSesion,request.id);
  //   },
  // });

  valorForm = effect(() => {
    const info = this.getInfoSesionPostResource.value();

    if (info && info.sesion) {
      this.form = this.fb.group({
        id: [0],
        pelicula: [
          this.getInfoSesionPostResource.value()?.peliculas[0],
          Validators.required,
        ],
        sala: ['', Validators.required],
        estado: ['', Validators.required],
        inicio: ['', Validators.required],
        inicioRespuesta: [''],
      });
    }
  });

  obtenerValorFechaSiguiente = effect(() => {
    const valueFecha = this.obtenerSiguienteFechaResource.value();
    this.fechaSiguiente.set(valueFecha);
    console.log(this.fechaSiguiente());
  });

  getFieldError(filedName: string): string | null {
    if (!this.form.controls[filedName]) return null;

    const errors = this.form.controls[filedName].errors ?? {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'max':
          return `Valor máximo de ${errors['max'].max}`;

        case 'pattern':
          return 'Debe ser un núumero válido';
      }
    }

    return null;
  }

  save() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    const info = this.form.value;
    const peliculas = this.getInfoSesionPostResource.value()?.peliculas;
    const salas = this.getInfoSesionPostResource.value()?.salas;

    const peliculaSeleccionada = peliculas?.find(
      (x) => x.titulo === info.pelicula
    );
    const salaSeleccionada = salas?.find((x) => x.nombre === info.sala);

    if (!peliculaSeleccionada || !salaSeleccionada) {
      console.error('No encontrada la sala o pelicula');
      return;
    }

    const infoSend = {
      id: info.id,
      idPelicula: peliculaSeleccionada.id,
      idSala: salaSeleccionada.id,
      estado: info.estado,
      inicio: this.datePipe.transform(
        this.fechaSiguiente(),
        'yyyy-MM-ddTHH:mm'
      )!,
    };

    this.infoPutSesion.set(infoSend);
    this.form.reset();
    this.form.patchValue({ estado: 'PROGRAMADA' });
  }

  obtenerSiguienteFechaResource = rxResource({
    request: () => ({
      fecha: this.fechaBuscar(),
      sala: this.sala(),
    }),
    loader: ({ request }) => {
      if (!request.fecha || !request.sala) return of(undefined);
      const fechaStr = this.datePipe.transform(
        request.fecha,
        'yyyy-MM-ddTHH:mm'
      )!;
      return this.adminService.getSiguienteFechaDisponibleSesion(
        fechaStr,
        request.sala
      );
    },
  });

  crearSesionResource = rxResource({
    request: () => ({
      infoSesion: this.infoPutSesion(),
    }),
    loader: ({ request }) => {
      if (!request.infoSesion) return of(undefined);
      return this.adminService.crearSesion(request.infoSesion);
    },
  });

  mostrarAlertas = signal<boolean | undefined>(undefined);
  comprobarEstadoCreacion = effect(() => {
    const value = this.crearSesionResource.hasValue();
    console.log(value);
    this.mostrarAlertas.set(true);
    setTimeout(() => {
      this.mostrarAlertas.set(false);
    }, 2000);
  });

  ngOnInit() {
    this.form = this.fb.group({
      id: [0],
      pelicula: ['', Validators.required],
      sala: ['', Validators.required],
      estado: ['PROGRAMADA', Validators.required],
      inicio: ['', Validators.required],
      inicioRespuesta: [''],
    });

    this.form.valueChanges.subscribe((values) => {
      const { sala, inicio } = values;
      if (sala && inicio) {
        console.log(sala, inicio);
        this.sala.set(sala);
        this.fechaBuscar.set(new Date(inicio));
      }
    });
  }
}
