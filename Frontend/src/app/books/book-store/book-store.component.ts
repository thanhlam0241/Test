import { Component } from '@angular/core';
import { Book, ResultPaging } from '../../models/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/services/api.service';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'book-store',
  templateUrl: './book-store.component.html',
  styleUrl: './book-store.component.scss',
  imports: [MatGridListModule],
  standalone: true,
})
export class BookStoreComponent {
  displayedColumns: string[] = [
    'id',
    'title',
    'author',
    'publisher',
    'available',
    'borrow',
  ];
  books: Book[] = [];
  count: number = 0;
  currentPage: number = 1;
  totalPages: number = 0;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
    apiService.getBooks().subscribe({
      next: (res: ResultPaging<Book>) => {
        this.books = res.results;
        this.count = res.count;
      },
    });
  }

  previousPage() {
    this.currentPage--;
  }

  nextPage() {
    this.currentPage++;
  }

  searchBooks(value: string) {
    value = value.toLowerCase();
    this.books = this.books.filter((book) => {
      return book.title.toLowerCase().includes(value);
    });
  }

  getBookCount() {
    return this.count;
  }

  orderBook(book: Book) {
    this.apiService.orderBook(book).subscribe({
      next: (res) => {
        if (res === 'ordered') {
          book.available = false;
          let today = new Date();
          let returnDate = new Date();
          returnDate.setDate(today.getDate() + 10);

          this.snackBar.open(
            book.title +
              ' has been borrowed! You will have to return on ' +
              returnDate.toDateString(),
            'OK'
          );
        } else {
          this.snackBar.open(
            'You already have 3 books pending to return.',
            'OK'
          );
        }
      },
    });
  }
}
