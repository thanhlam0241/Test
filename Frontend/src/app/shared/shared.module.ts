import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PageFooterComponent } from './components/page-footer/page-footer.component';
import { PageSideNavComponent } from './components/page-side-nav/page-side-nav.component';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PageTableComponent } from './components/page-table/page-table.component';
import { ToastComponent } from './components/toast/toast.component';
import { BookComponent } from './components/book/book.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    PageHeaderComponent,
    PageFooterComponent,
    PageSideNavComponent,
    PageNotFoundComponent,
    PageTableComponent,
    ToastComponent,
    BookComponent,
    BookFormComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    DialogComponent,
    MatTabsModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    PageHeaderComponent,
    PageFooterComponent,
    PageSideNavComponent,
    RouterModule,
    PageNotFoundComponent,
    ReactiveFormsModule,
    PageTableComponent,
    ToastComponent,
    BookComponent,
    DialogComponent,
    BookFormComponent,
  ],
})
export class SharedModule {}
