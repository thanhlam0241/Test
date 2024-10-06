import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  loggedIn: boolean = false;
  name: string = '';
  @Output()
  onToggleMenu = new EventEmitter<void>();

  constructor(private apiService: ApiService) {
    apiService.userStatus.subscribe({
      next: (res) => {
        let user = apiService.getUserInfo()!;
        if (res && user) {
          this.loggedIn = true;
          this.name = `${user.name}`;
        } else {
          this.loggedIn = false;
          this.name = '';
        }
      },
    });
  }
  logout() {
    this.apiService.logOut();
  }
  onToggle() {
    this.onToggleMenu.emit();
  }
}
