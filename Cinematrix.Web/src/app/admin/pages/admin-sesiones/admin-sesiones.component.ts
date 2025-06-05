import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sesiones',
  imports: [TitleCasePipe, DatePipe, ReactiveFormsModule],
  providers:[DatePipe],
  templateUrl: './admin-sesiones.component.html',
  styleUrl: './admin-sesiones.component.css',
})
export class AdminSesionesComponent {

  datePipe=inject(DatePipe)
  goCreateSesion() {
    this.router.navigate(['admin/sesiones/crear']);
  }
  router=inject(Router)
  fb = inject(FormBuilder);

  form = this.fb.group({
    estado: [''],
    fecha: [''],
  });

  estadoSesiones = signal<string[]>([
    'ACTIVA',
    'CANCELADA',
    'TERMINADA',
    'PROGRAMADA',
  ]);
  fecha = signal<string | undefined>(undefined);
  estado = signal<string | undefined>(undefined);
  adminService = inject(AdminService);

  getSesionesResource = rxResource({
    request: () => ({
      estado: this.estado(),
      fecha: this.fecha(),
    }),
    loader: ({ request }) => {
      return this.adminService.getSesiones(request.fecha, request.estado);
    },
  });

  onFilter() {
    if (this.form.valid) {
      console.log(this.form.value.fecha);
      let fechaFormat;
      if (this.form.value.fecha) {
        const fecha = new Date(this.form.value.fecha);
        fechaFormat = this.datePipe.transform(fecha, 'yyyy-MM-ddTHH:mm');
      }

      this.estado.set(this.form.value.estado ?? undefined);
      this.fecha.set(fechaFormat ?? undefined);
    }
  }
    goToEditSesion(id:number) {
        this.router.navigate(['admin/sesiones',id]);
  }
}
