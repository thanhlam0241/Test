// modify-book-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
// import { MatButtonModule } from '@angular/material/button';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { BookCategory, ResultPaging } from '../../../models/models';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
  // imports: [MatDialogActions, MatDialogContent, MatButtonModule],
  // standalone: true,
})
export class BookFormComponent {
  bookForm: FormGroup;
  availableCategories: BookCategory[] = []; // Example categories

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BookFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Data passed to the dialog,
  ) {
    this.bookForm = this.fb.group({
      title: [data?.book?.title || '', Validators.required],
      description: [data?.book?.description || '', Validators.required],
      number: [
        data?.book?.number || '',
        [Validators.required, Validators.min(1)],
      ],
      price: [
        data?.book?.price || '',
        [Validators.required, Validators.min(0)],
      ],
      url: [data?.book?.url || '', Validators.required],
      categories: [data?.book?.categories || [], Validators.required],
      author: [data?.book?.author || '', Validators.required],
    });
    this.getCategory();
  }

  getCategory() {
    this.api.getCategories().subscribe({
      next: (res: ResultPaging<BookCategory>) => {
        this.availableCategories = res.results;
      },
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      // Return the modified book details
      this.dialogRef.close(this.bookForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
