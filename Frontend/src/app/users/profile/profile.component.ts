import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

export interface TableElement {
  name: string;
  value: string;
}

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  columns: string[] = ['name', 'value'];
  dataSource: TableElement[] = [];

  constructor(private apiService: ApiService) {
    let user = apiService.getUserInfo()!;
    this.dataSource = [
      { name: 'Name', value: user.name },
      { name: 'Email', value: `${user.email}` },
      { name: 'Mobile', value: `${user.mobileNumber}` },
      { name: 'Created On', value: `${user.date_joined}` },
      { name: 'Address', value: `${user.address}` },
    ];
  }
}
