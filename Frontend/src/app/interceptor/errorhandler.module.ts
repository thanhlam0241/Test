import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from '../shared/services/toast-service.service';

@Injectable({
  providedIn: 'root',
})
export class CustomErrorHandlerService implements ErrorHandler {
  toastService = inject(ToastService);

  //This method comes from interface
  handleError(error: any): void {
    console.log(error);
    this.toastService.showToast('danger-toast', error.message);
  }
}
