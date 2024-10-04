import { Component } from '@angular/core';
import { Record, RecordAdmin, ResultPaging } from '../../models/models';
import { ApiService } from '../../shared/services/api.service';
import { STATUS_BOOK } from '../../enum/OrderStatus';
import { MatTabChangeEvent } from '@angular/material/tabs';

const tabValue = {
  1: STATUS_BOOK.PENDING.value,
  2: STATUS_BOOK.BORROWED.value,
  3: STATUS_BOOK.RETURN.value,
};

@Component({
  selector: 'all-orders',
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss',
})
export class AllOrdersComponent {
  columns: string[] = [
    'order_id',
    'user_id',
    'book_id',
    'borrow_date',
    'status',
    'action',
  ];
  pendingRecords: Record[] = [];
  borrowingRecord: Record[] = [];
  returnedRecord: Record[] = [];

  tab: 1 | 2 | 3 = 1;
  count: number = 0;
  currentPage: number = 1;
  totalPages: number = 0;

  constructor(private apiService: ApiService) {
    this.getData();
  }

  changeTab(e: MatTabChangeEvent) {
    this.tab = (e.index + 1) as 1 | 2 | 3;
    this.currentPage = 1;
    this.getData();
  }

  getTextTab(type: number) {
    switch (type) {
      case 1:
        return `Pending`;
      case 2:
        return `Borrowing`;
      default:
        return `Returned`;
    }
  }

  convertData(res: RecordAdmin[]): Record[] {
    return res.map((item: RecordAdmin) => {
      return {
        id: item.id,
        status: item.status,
        user_id: item.user,
        book_id: item.book.id,
        borrow_date: item.borrow_date,
        return_date: item.return_date,
        is_complete: false,
      };
    });
  }

  getData() {
    this.apiService
      .getAllOrder(this.currentPage, tabValue[this.tab])
      .subscribe({
        next: (res: ResultPaging<RecordAdmin>) => {
          this.totalPages = this.totalPages = Math.ceil((res.count || 0) / 20);
          this.count = res?.count || 0;
          switch (this.tab) {
            case 1:
              this.pendingRecords = this.convertData(res.results);
              break;
            case 2:
              this.borrowingRecord = this.convertData(res.results);
              break;
            default:
              this.returnedRecord = this.convertData(res.results);
              break;
          }
        },
      });
  }

  previousPage() {
    this.currentPage--;
    this.getData();
  }

  nextPage() {
    this.currentPage++;
    this.getData();
  }

  getFineToPay(order: Record) {
    return this.apiService.getFine(order);
  }

  action(data: Record) {
    console.log(data);
    switch (this.tab) {
      case 1:
        this.apiService.acceptBorrow(data.user_id, data.book_id).subscribe({
          next: (res) => {
            this.getData();
          },
        });
        break;
      case 2:
        this.apiService.acceptReturn(data.user_id, data.book_id).subscribe({
          next: (res) => {
            this.getData();
          },
        });
        break;
      default:
        break;
    }
  }
}
