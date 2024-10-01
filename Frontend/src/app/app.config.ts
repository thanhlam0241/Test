import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return localStorage.getItem('access');
          },
          allowedDomains: ['localhost:8000'],
        },
      })
    ),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
