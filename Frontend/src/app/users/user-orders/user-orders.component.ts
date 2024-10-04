import { Component } from '@angular/core';
import { Record } from '../../models/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/services/api.service';
import { STATUS_BOOK } from '../../enum/OrderStatus';

@Component({
  selector: 'user-orders',
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss',
})
export class UserOrdersComponent {
  columns: string[] = [
    'order_id',
    'user_id',
    'book_id',
    'borrow_date',
    'status',
  ];
  pendingRecords: Record[] = [];
  borrowingRecord: Record[] = [];
  returnedRecord: Record[] = [];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
    let userId = this.apiService.getUserInfo()!.id;
    apiService.getOrdersOfUser(userId).subscribe({
      next: (res: Record[]) => {
        this.pendingRecords = res.filter(
          (o) => o.status === STATUS_BOOK.PENDING.value
        );
        this.borrowingRecord = res.filter(
          (o) => o.status === STATUS_BOOK.BORROWED.value
        );
        this.returnedRecord = res.filter(
          (o) => o.status === STATUS_BOOK.RETURN.value
        );
      },
    });
  }

  getTextTab(type: number) {
    switch (type) {
      case 1:
        return `Pending (${this.pendingRecords.length})`;
      case 2:
        return `Borrowing (${this.borrowingRecord.length})`;
      default:
        return `Returned (${this.returnedRecord.length})`;
    }
  }

  getFineToPay(order: Record) {
    return this.apiService.getFine(order);
  }
}
