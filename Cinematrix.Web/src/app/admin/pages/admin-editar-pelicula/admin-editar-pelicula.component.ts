import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { of } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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


  eliminar=signal(false)






  infoPelicula=signal<Pelicula|undefined>(undefined)

  idPelicula = signal<number | undefined>(undefined);
  activatedRoute = inject(ActivatedRoute);
  adminService = inject(AdminService);
  fb = inject(FormBuilder);
  peliculasResource = rxResource({
    request: () => ({
      id: this.idPelicula(),
      infoPelicula:this.infoPelicula()
    }),
    loader: ({ request }) => {
      if (!request.id) return of(undefined);
      if(!request.infoPelicula)   return this.adminService.getPeliculaInfo(request.id);
       return this.adminService.actualizarPelicula(request.id,request.infoPelicula);
    },
  });



  form!:FormGroup;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.idPelicula.set(Number(params.get('id')));
    });
  }

  valorForm = effect(() => {
    const info = this.peliculasResource.value();
    console.log(info);
    if (info) {
      this.form = this.fb.group({
        titulo: [info.pelicula.titulo],
        anio: [info.pelicula.anio],
        duracion: [info.pelicula.duracion],
        sinopsis: [info.pelicula.sinopsis],
        trailer: [info.pelicula.trailer],
        categoria: [info.pelicula.categoria],
        calificacion: [info.pelicula.calificacion],
        formato: [info.pelicula.formato],
        imagen:[info.pelicula.imagen],
        poster:[info.pelicula.poster]
      });
    }
  });

  save() {

    if(!this.form.valid){
      this.form.markAllAsTouched();
      return;
    }

    const datos=this.form.value;
    this.infoPelicula.set(datos);


  }
}
