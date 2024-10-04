import { Component, Input } from '@angular/core';
import { Book } from '../../../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
})
export class BookComponent {
  @Input()
  book: Book | null = null;

  constructor(private router: Router) {}

  setDefaultImage(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src =
      'https://static-01.daraz.pk/p/3fe9c8a1dbfb5b3910e306183ec5d669.jpg'; // Đường dẫn đến ảnh mặc định trong thư mục assets
  }

  goToDetail(id: number | undefined) {
    if (id) this.router.navigateByUrl(`/book/${id}`);
    else {
      console.log('Error with id, ', id);
    }
  }

  getBookPrice() {
    if (this.book && this.book?.price) {
      return `${this.book.price}$`;
    }
    return '0$';
  }
}
