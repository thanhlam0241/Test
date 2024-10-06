import { Component, OnDestroy } from '@angular/core';
import { Book, ResultPaging } from '../../models/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/services/api.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'book-store',
  templateUrl: './book-store.component.html',
  styleUrl: './book-store.component.scss',
})
export class BookStoreComponent {
  displayedColumns: string[] = ['id', 'title', 'author', 'publisher', 'number'];
  books: Book[] = [];
  count: number = 0;
  currentPage: number = 1;
  totalPages: number = 0;
  private searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 300; // Set the debounce time (in milliseconds)
  searchStr: string | null = '';

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
    this.getDataBook();
    this.searchSubject
      .pipe(debounceTime(this.debounceTimeMs))
      .subscribe((searchValue) => {
        this.performSearch(searchValue);
      });
  }

  getDataBook() {
    this.apiService.getBooks(this.currentPage, this.searchStr).subscribe({
      next: (res: ResultPaging<Book>) => {
        this.books = res.results;
        this.count = res.count || 0;
        this.totalPages = Math.ceil((res.count || 0) / 20);
      },
    });
  }

  previousPage() {
    this.currentPage--;
    this.getDataBook();
  }

  nextPage() {
    this.currentPage++;
    this.getDataBook();
  }

  searchBooks(value: string) {
    value = value.toLowerCase();
    this.searchSubject.next(value);
  }

  performSearch(searchValue: string) {
    // Perform the actual search operation here
    console.log('Performing search for:', searchValue);
    this.searchStr = searchValue;
    this.getDataBook();
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  getBookCount() {
    return this.count;
  }

  orderBook(book: Book) {
    this.apiService.orderBook(book).subscribe({
      next: (res) => {
        if (res === 'ordered') {
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
