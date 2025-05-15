import { Component, input, signal } from '@angular/core';
import { Poster } from '../../interfaces/poster.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-posters',
  imports: [NgClass],
  templateUrl: './posters.component.html',
  styleUrl: './posters.component.css',
})
export class PostersComponent {
  urlBase: string = './img/posters/poster-';
  platform: string = 'Unsplash';
  posters = input<Poster[]>();

  currentSlide = signal(0);

  intervalo: any;

  prevSlide() {
    let previous =
      this.currentSlide() === 0
        ? this.posters()!.length - 1
        : this.currentSlide() - 1;
    this.currentSlide.set(previous);
    this.resetInterval();
  }

  nextSlide() {
    let next =
      this.currentSlide() === this.posters()!.length - 1
        ? 0
        : this.currentSlide() + 1;
    this.currentSlide.set(next);

   this.resetInterval();
  }

  ngOnInit(): void {
    this.startInterval();
  }

  startInterval() {
    this.intervalo = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  resetInterval() {
    clearInterval(this.intervalo);
    this.startInterval();
  }
}
