import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Book,
  BookCategory,
  BookCategoryInsertDto,
  BookInsertDto,
  ResultPaging,
} from '../../models/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/services/api.service';

export interface CategoryOption {
  displayValue: string;
  value: number;
}

@Component({
  selector: 'maintenance',
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
})
export class MaintenanceComponent {
  newCategory: FormGroup;
  newBook: FormGroup;
  categoryOptions: CategoryOption[] = [];

  constructor(
    fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.newCategory = fb.group({
      category: fb.control('', [Validators.required]),
    });

    this.newBook = fb.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      description: ['', [Validators.required]],
      url: ['', [Validators.required]],
      number: [1, [Validators.required]],
      price: [1, [Validators.required]],
      categories: [[], [Validators.required]],
    });

    apiService.getCategories().subscribe({
      next: (res: ResultPaging<BookCategory>) => {
        res.results.forEach((c) => {
          this.categoryOptions.push({
            value: c.id,
            displayValue: `${c.name}`,
          });
        });
      },
    });
  }

  addNewCategory() {
    let bookCategory: BookCategoryInsertDto = {
      name: this.newCategory.get('name')?.value,
    };
    this.apiService.addNewCategory(bookCategory).subscribe({
      next: (res) => {
        if (!res) {
          this.snackBar.open('Already Exists!', 'OK');
        } else {
          this.snackBar.open('INSERTED', 'OK');
        }
      },
    });
  }

  addNewBook() {
    let book: BookInsertDto = {
      title: this.newBook.get('title')?.value,
      author: this.newBook.get('author')?.value,
      url: this.newBook.get('url')?.value,
      publisher: this.newBook.get('publisher')?.value,
      categories: this.newBook.get('category')?.value,
    };

    this.apiService.addBook(book).subscribe({
      next: (res) => {
        if (res) this.snackBar.open('Book Added', 'OK');
      },
    });
  }
}
