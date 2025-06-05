import { Component, effect, inject, signal } from '@angular/core';
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
import { DatePipe, TitleCasePipe } from '@angular/common';
import { PUTsesion } from '../../interfaces/put-sesion.interface';

@Component({
  selector: 'app-admin-editar-sesion',
  imports: [TitleCasePipe, ReactiveFormsModule, DatePipe],
  templateUrl: './admin-editar-sesion.component.html',
  styleUrl: './admin-editar-sesion.component.css',
})
export class AdminEditarSesionComponent {
  errorEditar: any;
  errorEliminar: any;

  goBack() {
  this.router.navigate(['admin/sesiones']);
  }


  infoPutSesion=signal<undefined|PUTsesion>(undefined)

  estadoSesiones = signal<string[]>([
    'ACTIVA',
    'CANCELADA',

    'TERMINADA',
    'PROGRAMADA',
  ]);

  idSesion = signal<number | undefined>(undefined);
  eliminar = signal<boolean | undefined>(undefined);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  adminService = inject(AdminService);
  fb = inject(FormBuilder);
  form!: FormGroup;


  mostrarAlertas = signal<boolean | undefined>(undefined);
  comprobarEstadoCreacion = effect(() => {
    const value = this.putSesionResource.hasValue();
    const error=this.putSesionResource.error()

    if(value){
      this.goBack()
    }
    this.mostrarAlertas.set(true);
    setTimeout(() => {
      this.mostrarAlertas.set(false);
    }, 2000);
  });

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.idSesion.set(Number(params.get('id')));
      console.log(this.idSesion);
    });

       this.form = this.fb.group({
      id: [''],
      pelicula: ['', Validators.required],
      sala: ['', Validators.required],
      estado: ['', Validators.required],
      inicio: ['', Validators.required],
    });
  }

  getInfoSesionResource = rxResource({
    request: () => ({
      id: this.idSesion(),
    }),
    loader: ({ request }) => {
      if (!request.id) return of(undefined);

      return this.adminService.getSesion(request.id);
    },
  });

  putSesionResource=rxResource({
    request: () => ({
      id: this.idSesion(),
      infoSesion:this.infoPutSesion()
    }),
    loader: ({ request }) => {
      if (!request.id || !request.infoSesion) return of(undefined);


      return this.adminService.putSesion(request.infoSesion,request.id);
    },
  });

  valorForm = effect(() => {
    const info = this.getInfoSesionResource.value();

    console.log(info);
    if (info && info.sesion) {
      this.form = this.fb.group({
        id: [info.sesion.id],
        pelicula: [info.sesion.pelicula, Validators.required],
        sala: [info.sesion.sala, Validators.required],
        estado: [info.sesion.estado, Validators.required],
      });
    }
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
    if (!this.form.valid) return;
    const info = this.form.value;
    const peliculas = this.getInfoSesionResource.value()?.peliculas;
    const salas = this.getInfoSesionResource.value()?.salas;

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
      inicio:undefined
    };

    this.infoPutSesion.set(infoSend)
  }
}
