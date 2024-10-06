import { Component, OnInit } from '@angular/core';
// import this ⤵
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ToastService } from '../../services/toast-service.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  // And then these ⤵
  animations: [
    trigger('toastTrigger', [
      // This refers to the @trigger we created in the template
      state('open', style({ transform: 'translateY(0%)' })), // This is how the 'open' state is styled
      state('close', style({ transform: 'translateY(-200%)' })), // This is how the 'close' state is styled
      transition('open <=> close', [
        // This is how they're expected to transition from one to the other
        animate('300ms ease-in-out'),
      ]),
    ]),
  ],
})
export class ToastComponent implements OnInit {
  // Change the default values to types
  toastClass: string[];
  toastMessage: string;
  showsToast: boolean;

  constructor(public toast: ToastService) {
    this.toastClass = [];
    this.toastMessage = '';
    this.showsToast = false;
  } // We inject the toast.service here as 'public'

  ngOnInit(): void {}

  // We'll add this to the dismiss button in the template
  dismiss(): void {
    this.toast.dismissToast();
  }
}
