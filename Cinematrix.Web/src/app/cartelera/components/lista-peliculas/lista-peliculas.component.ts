import { Component, input, NgModule, signal } from '@angular/core';
import { Pelicula } from '../../interfaces/pelicula.interface';
import { NgClass, NgStyle } from '@angular/common';
// import { DatePickerModule } from 'primeng/datepicker';
import { DatePickerModule } from 'primeng/datepicker';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-lista-peliculas',

  imports: [NgClass,DatePickerModule, ReactiveFormsModule],
  templateUrl: './lista-peliculas.component.html',
  styleUrl: './lista-peliculas.component.css',
})
export class ListaPeliculasComponent {



  
  films=input<Pelicula[]>();
  errorMessage=input<string|unknown|null>()
  isLoading=input<boolean>(false)
  isEmpty=input<boolean>(false)
  hovering=signal(false)
  isOver=signal(false);
  idFilmSelected=signal(-1)
  onMouseLeaveFilm(){
       this.hovering.set(false);
    // this.isOver.set(false)
    this.idFilmSelected.set(-1)
    console.log(this.idFilmSelected())
    console.log(this.idFilmSelected())

  }

  onMouseOverFilm(event:MouseEvent,id:number){
    // this.isOver.set(true)
    this.hovering.set(true);
    event.stopPropagation();
    console.log(event.target)
    console.log({id,
    })
    this.idFilmSelected.set(id)
    console.log(this.idFilmSelected())
  }


  transformDate(fecha:Date){
    const sesion=new Date(fecha);
    const hour = sesion.getHours().toString().padStart(2, '0');
    const minutes = sesion.getMinutes().toString().padStart(2, '0');
    return`${hour}:${minutes}`;
  }


 }
