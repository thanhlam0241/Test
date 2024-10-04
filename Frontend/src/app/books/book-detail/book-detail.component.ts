import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { Book, BookCategory, ResultPaging } from '../../models/models';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import {
  ToastService,
  TOAST_STATE,
} from '../../shared/services/toast-service.service';
import { BookFormComponent } from '../../shared/components/book-form/book-form.component';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
  // Add any data you want to display or mock
  book: Book | null = null;
  available: boolean = false;
  numberBorrowed: number = 0;
  listCategory: BookCategory[] = [];
  isAdmin: boolean = false;
  actionCanDo: string = 'Borrow';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.api.isAdmin();
    this.route.paramMap.subscribe((params: ParamMap) => {
      let bookId = +(params.get('id') ?? 0);
      this.api.getBookinfo(bookId).subscribe({
        next: (res: Book) => {
          this.book = res;
          if (res.categories && res.categories.length)
            this.getListCategories(res.categories);
          this.getBorrowBookList(bookId, res?.number || 0);
          this.getBookStatus(bookId);
        },
      });
    });
  }

  getListCategories(ids: number[]) {
    this.api.getCategoriesByListIds(ids).subscribe({
      next: (res2: ResultPaging<BookCategory>) => {
        this.listCategory = res2.results;
      },
    });
  }

  getBorrowBookList(bookId: number, res: number) {
    this.api.getBorrowBookList(bookId).subscribe({
      next: (res1: any) => {
        let numberBorrowed = res1?.length || 0;
        this.numberBorrowed = numberBorrowed;
        if (this.available && numberBorrowed === res) {
          this.available = false;
        }
      },
    });
  }

  getBookStatus(bookId: number) {
    this.api.getBookStatus(bookId).subscribe({
      next: (res: any) => {
        if (res && res[0]) {
          let d = res[0];
          if (!d?.is_complete) this.available = false;
        } else {
          this.available = true;
          this.actionCanDo = 'Borrow';
        }
      },
    });
  }

  getBookField(field: string) {
    if (!this.book || !this.book.hasOwnProperty(field)) return '';
    return (this.book as Record<string, any>)[field];
  }

  getListCategoriesName() {
    let n = this.listCategory?.length;
    if (!n || n === 0) return ['Unknown'];
    let res: string[] = [];
    let l = n > 6 ? 6 : n;
    for (let i = 0; i < l; ++i) {
      res.push(this.listCategory[i]?.name || '');
    }
    return res;
  }

  onBorrow(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        header: 'Do you want to borrow this book ?',
        content:
          'After the manager accept this request, you can go to the store and borrow it! Remember to prepare enough money!',
      },
      panelClass: 'my-custom-dialog-class',
    });

    // Optional: Handling the dialog close event
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.book) {
          this.api.borrowBook(this.book.id).subscribe({
            next: () => {
              this.toastService.showToast(
                TOAST_STATE.success,
                'Request send! Go to the store and ask manager.'
              );
              this.available = false;
            },
          });
        }
        // Perform your action here on agreement
      } else {
        console.log('User closed the dialog.');
      }
    });
  }

  onModify() {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '70%',
      height: '80%',
      data: { book: this.book },
      panelClass: 'my-book-form',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Modified book:', result);
        // Save the modified book data
        this.api
          .updateBook({
            ...result,
            id: this.book!.id,
          })
          .subscribe({
            next: (res) => {
              if (res) {
                this.book = result;
                this.toastService.showToast(
                  TOAST_STATE.success,
                  'Update successfully'
                );
              }
            },
          });
      }
    });
  }
}
