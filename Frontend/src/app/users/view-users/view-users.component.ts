import { Component } from '@angular/core';
import { User, ResultPaging } from '../../models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'view-users',
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.scss',
})
export class ViewUsersComponent {
  columns: string[] = [
    'id',
    'name',
    'email',
    'mobileNumber',
    'address',
    'approve',
  ];
  users: User[] = [];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
    apiService.getUsers().subscribe({
      next: (res: ResultPaging<User>) => {
        this.users = res.results;
      },
    });
  }

  unblockUser(user: User) {
    var id = user.id;
    this.apiService.unblock(id).subscribe({
      next: (res) => {
        if (res === 'unblocked') {
          this.snackBar.open('User has been UNBLOCKED!', 'OK');
        } else this.snackBar.open('Not Unblocked', 'OK');
      },
    });
  }
}
