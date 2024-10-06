import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ErrorHandler } from '@angular/core';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { CustomErrorHandlerService } from './interceptor/errorhandler.module';
import { LoadingService } from './shared/services/loading.service';
import { LoadingInterceptor } from './interceptor/loading.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

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
      }),
      LoadingService
    ),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: ErrorHandler, useExisting: CustomErrorHandlerService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
};
