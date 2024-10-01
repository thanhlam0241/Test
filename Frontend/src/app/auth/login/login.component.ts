import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword: boolean = true;

  constructor(
    fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = fb.group({
      email: fb.control('thanhlam0241@gmail.com', [Validators.required]),
      password: fb.control('123456', [Validators.required]),
    });
  }

  async login() {
    let loginInfo = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };
    this.apiService.login(loginInfo).subscribe({
      next: (res) => {
        if (res?.access == null)
          this.snackBar.open('Credential are invalid!', 'OK');
        else {
          localStorage.setItem('access', res.access);
          this.apiService.userStatus.next('loggedIn');
        }
      },
    });
  }
}
