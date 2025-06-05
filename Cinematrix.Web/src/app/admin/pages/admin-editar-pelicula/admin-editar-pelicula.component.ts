import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { of } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { InfoPelicula } from '../../interfaces/info-pelicula';
import { Pelicula } from '../../interfaces/pelicula.interface';

@Component({
  selector: 'app-admin-editar-pelicula',
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './admin-editar-pelicula.component.html',
  styleUrl: './admin-editar-pelicula.component.css',
})
export class AdminEditarPeliculaComponent {
  mostrarAlertas = signal(false);
  infoPelicula = signal<Pelicula | undefined>(undefined);
  errorEliminar = signal<boolean | undefined>(undefined);
  errorEditar = signal<boolean | undefined>(undefined);
  router = inject(Router);
  idPelicula = signal<number | undefined>(undefined);
  activatedRoute = inject(ActivatedRoute);
  adminService = inject(AdminService);
  fb = inject(FormBuilder);
  eliminar = signal<boolean | undefined>(undefined);
  peliculasResource = rxResource({
    request: () => ({
      id: this.idPelicula(),
    }),
    loader: ({ request }) => {
      if (!request.id) return of(undefined);

      return this.adminService.getPeliculaInfo(request.id);
    },
  });

  edicionPeliculaResource = rxResource({
    request: () => ({
      id: this.idPelicula(),
      infoPelicula: this.infoPelicula(),
    }),
    loader: ({ request }) => {
      if (!request.infoPelicula || !request.id) return of(undefined);

      return this.adminService.actualizarPelicula(
        request.id,
        request.infoPelicula
      );
    },
  });

  eliminarPeliculaResource = rxResource({
    request: () => ({
      id: this.idPelicula(),
      eliminar: this.eliminar(),
    }),
    loader: ({ request }) => {
      if (!request.id || !request.eliminar) return of(undefined);

      return this.adminService.eliminarPelicula(request.id);
    },
  });

  form!: FormGroup;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.idPelicula.set(Number(params.get('id')));
    });
  }

  erroresEdicionEffect = effect(() => {
    const error = this.edicionPeliculaResource.error();
    const exitoso = this.edicionPeliculaResource.hasValue();
    if (!this.mostrarAlertas) return;

    console.log(this.edicionPeliculaResource.error());
    if (error) {
      this.errorEditar.set(true);
        setTimeout(() => {
      console.log();
      this.errorEditar.set(undefined);
      this.mostrarAlertas.set(false);
    }, 3000);
    }
    if (exitoso) this.goBack();


    //     } else if (exitoso) {
    //  this.mostrarAlertas.set(false)
    //       this.goBack();
    //     }
  });

  erroresEliminacionEffect = effect(() => {
    const error = this.eliminarPeliculaResource.error();
    const exitoso = this.eliminarPeliculaResource.hasValue();
    if (!this.eliminar()) return;
    console.log(error);

    console.log(this.eliminarPeliculaResource.error());
    if (error) {
      this.errorEliminar.set(true);

      setTimeout(() => {
        console.log();
        this.errorEliminar.set(undefined);
        this.eliminar.set(undefined);
      }, 3000);
    } else if (exitoso) {
      this.eliminar.set(undefined);
      this.goBack();
    }
  });

  valorForm = effect(() => {
    const info = this.peliculasResource.value();
    console.log(info);
    if (info && info.pelicula) {
      this.form = this.fb.group({
        id: [info.pelicula.id],
        titulo: [
          info.pelicula.titulo,
          [Validators.required, Validators.minLength(2)],
        ],
        anio: [
          info.pelicula.anio,
          [
            Validators.required,
            Validators.pattern(/^\d+$/),
            Validators.pattern(/^\d{4}$/),
            Validators.min(1880),
            Validators.max(new Date().getFullYear() + 2),
          ],
        ],
        duracion: [
          info.pelicula.duracion,
          [
            Validators.required,
            Validators.min(1),
            Validators.max(600),
            // Validators.pattern(/^\d+$/),
            ,
          ],
        ],
        sinopsis: [
          info.pelicula.sinopsis,
          [Validators.required, Validators.minLength(10)],
        ],
        trailer: [info.pelicula.trailer, Validators.required],
        categoria: [info.pelicula.categoria, Validators.required],
        calificacion: [info.pelicula.calificacion, Validators.required],
        formato: [info.pelicula.formato, Validators.required],
        imagen: [info.pelicula.imagen, Validators.required],
        poster: [info.pelicula.poster, Validators.required],
      });
    }
  });

  save() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('object');
    const datosForm = this.form.value;
    this.infoPelicula.set(datosForm);
    this.mostrarAlertas.set(true);
  }

  eliminarPelicula() {
    this.eliminar.set(true);
    this.eliminarPeliculaResource.reload();
    console.log(this.eliminarPeliculaResource.error());
    //REVISAR
    // this.mostrarAlertas.set(true);
    // setTimeout(() => {
    //   this.mostrarAlertas.set(false);
    //   this.errorEliminar.set(false)
    // }, 2000);
  }

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

  goBack() {
    this.router.navigate(['admin/peliculas']);
  }
}
