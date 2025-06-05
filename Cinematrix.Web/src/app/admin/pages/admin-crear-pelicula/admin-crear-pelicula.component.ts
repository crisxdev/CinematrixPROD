import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { TitleCasePipe } from '@angular/common';
import { Pelicula } from '../../interfaces/pelicula.interface';
import { of } from 'rxjs';

@Component({
  selector: 'app-admin-crear-pelicula',
  imports: [TitleCasePipe, ReactiveFormsModule],
  templateUrl: './admin-crear-pelicula.component.html',
  styleUrl: './admin-crear-pelicula.component.css',
})
export class AdminCrearPeliculaComponent {
  infoPelicula = signal<Pelicula | undefined>(undefined);
  router = inject(Router);
  fb = inject(FormBuilder);
  adminService = inject(AdminService);
  form!: FormGroup;
  mostrarAlertas = signal(false);
  ngOnInit() {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      anio: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.pattern(/^\d{4}$/),
          Validators.min(1880),
          Validators.max(new Date().getFullYear() + 2),
        ],
      ],
      duracion: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(600),
          Validators.pattern(/^\d+$/),
        ],
      ],
      sinopsis: ['', [Validators.required, Validators.minLength(10)]],
      trailer: ['', Validators.required],
      categoria: ['', Validators.required],
      calificacion: ['', Validators.required],
      formato: ['', Validators.required],
      imagen: ['', Validators.required],
      poster: ['', Validators.required],
    });
  }

  peliculasResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.adminService.getPeliculaParametersInfo();
    },
  });

  crearPeliculaResource = rxResource({
    request: () => ({
      pelicula: this.infoPelicula(),
    }),
    loader: ({ request }) => {
      if (!request.pelicula) return of(undefined);
      return this.adminService.postPelicula(request.pelicula);
    },
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const datosForm = this.form.value;
    this.infoPelicula.set(datosForm);
    this.mostrarAlertas.set(true);
    setTimeout(() => {
      this.mostrarAlertas.set(false);
    }, 2000);

    this.form.reset();
    console.log(this.infoPelicula());
  }

  goBack() {
    this.router.navigate(['admin/peliculas']);
  }
}

// myForm= new FormGroup({
//   name:new FormControl('', [], []),
//   price:new FormControl(0),
//   inStorage:new FormControl(0)
// })

// isValidField(fieldName:string):boolean|null{
//   console.log(this.myForm.controls[fieldName].errors && this.myForm.controls[fieldName].touched)
//   return (this.myForm.controls[fieldName].errors && this.myForm.controls[fieldName].touched ); // Si tiene error !! devuleve boolean
// }
