import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import localEs from '@angular/common/locales/es';
import { providePrimeNG } from 'primeng/config';
import { registerLocaleData } from '@angular/common';
import { loggingInterceptor } from './shared/components/interceptors/loggin.interceptor';
import { authInterceptor } from './auth/interceptors/auth.interceptor';


registerLocaleData(localEs, 'es');
export const appConfig: ApplicationConfig = {
  providers: [

    {
      provide:LOCALE_ID,
      useValue:'es'  // Para poner la app en español
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration:'top',
      anchorScrolling:'enabled'
    })),
    provideHttpClient(withFetch(),

  withInterceptors([loggingInterceptor,authInterceptor]))

  ],
};
