import { Component } from '@angular/core';
import { Record } from '../../models/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'user-orders',
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss',
})
export class UserOrdersComponent {
  columnsForPendingReturns: string[] = [
    'id',
    'userId',
    'userName',
    'bookTitle',
    'orderDate',
  ];
  columnsForCompletedReturns: string[] = [
    'id',
    'userId',
    'userName',
    'bookTitle',
    'orderDate',
    'returnedDate',
  ];
  pendingReturns: Record[] = [];
  completedReturns: Record[] = [];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
    let userId = this.apiService.getUserInfo()!.id;
    apiService.getOrdersOfUser(userId).subscribe({
      next: (res: Record[]) => {
        this.pendingReturns = res.filter((o) => o.status === 'Borrowed');
        this.completedReturns = res.filter((o) => o.status === 'Returned');
      },
    });
  }

  getFineToPay(order: Record) {
    return this.apiService.getFine(order);
  }
}
