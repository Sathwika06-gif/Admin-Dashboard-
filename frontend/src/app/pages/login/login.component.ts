import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← ADD THIS
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // ← ADD FormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.errorMessage = '';
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        if (res?.token) {
          this.auth.saveToken(res.token);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid response from server';
        }
      },
      error: (err: any) => {
        this.errorMessage = 'Login failed. Please check credentials.';
      }
    });
  }
}