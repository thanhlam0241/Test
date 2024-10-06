import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../shared/services/toast-service.service';
import { HttpStatusCode } from '@angular/common/http';
import { ApiService } from '../shared/services/api.service';

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
  constructor(
    public router: Router,
    private toastService: ToastService,
    private api: ApiService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        console.log('error is intercept');
        console.error(error);
        if (error instanceof HttpErrorResponse) {
          // This is an HttpErrorResponse
          console.log('HttpErrorResponse occurred:', error);
          console.log('Status Code:', error.status);
          console.log('Error Message:', error.message);
          switch (error.status) {
            case HttpStatusCode.Unauthorized:
              // handle when token expired or something
              this.api.logOut();
              break;
            default:
              break;
          }
        }
        this.toastService.showToast('danger-toast', 'Error occur');
        return throwError(() => error.message);
      })
    );
  }
}
