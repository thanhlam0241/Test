import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { ApiService } from './shared/services/api.service';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { LoadingIndicatorComponent } from './shared/components/loading/loading.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    RouterOutlet,
    SharedModule,
    AuthModule,
    UsersModule,
    BooksModule,
    LoadingIndicatorComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'UI';
  isOpen: boolean = false;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    let isLogin = this.apiService.isLoggedIn();
    let status: string = 'loggedOff';
    if (isLogin) {
      status = 'loggedIn';
    } else {
      // this.isOpen = true;
    }
    this.apiService.userStatus.next(status);
  }

  onToggle() {
    this.sidenav.toggle();
  }
}
