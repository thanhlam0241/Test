import { NgModule } from '@angular/core';
import { BookStoreComponent } from './book-store/book-store.component';
import { SharedModule } from '../shared/shared.module';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ReturnBookComponent } from './return-book/return-book.component';
import { BookDetailComponent } from './book-detail/book-detail.component';

@NgModule({
  declarations: [
    BookStoreComponent,
    MaintenanceComponent,
    ReturnBookComponent,
    BookDetailComponent,
  ],
  imports: [SharedModule],
})
export class BooksModule {}
