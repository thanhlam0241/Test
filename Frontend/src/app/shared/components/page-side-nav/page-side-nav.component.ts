import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

export interface NavigationItem {
  value: string;
  link: string;
}

@Component({
  selector: 'page-side-nav',
  templateUrl: './page-side-nav.component.html',
  styleUrl: './page-side-nav.component.scss',
})
export class PageSideNavComponent {
  panelName: string = '';
  navItems: NavigationItem[] = [];

  constructor(private apiService: ApiService, private router: Router) {
    apiService.userStatus.subscribe({
      next: (status) => {
        if (status == 'loggedIn') {
          // router.navigateByUrl('/home');
          let user = apiService.getUserInfo();
          if (user != null) {
            if (user.is_staff) {
              this.panelName = 'Admin Panel';
              this.navItems = [
                { value: 'View Books', link: '/home' },
                { value: 'Maintenance', link: '/maintenance' },
                { value: 'View Users', link: '/view-users' },
                { value: 'All Orders', link: '/all-orders' },
              ];
            } else {
              this.panelName = 'Student Panel';
              this.navItems = [
                { value: 'View Books', link: '/home' },
                { value: 'My Orders', link: '/my-orders' },
              ];
            }
          } else {
            this.panelName = '';
            router.navigateByUrl('/login');
            this.navItems = [];
          }
        } else if (status == 'loggedOff') {
          this.panelName = '';
          router.navigateByUrl('/login');
          this.navItems = [];
        }
      },
    });
  }
}
