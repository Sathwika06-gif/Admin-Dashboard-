import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  template: `
   <div style="
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f4f6;
">

  <div style="
    width: 400px;
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  ">

    <!-- 🔥 Header INSIDE card -->
    <div style="
      display:flex;
      align-items:center;
      gap:10px;
      margin-bottom:20px;
    ">
      <span style="
        background:#4f46e5;
        color:white;
        border-radius:50%;
        width:40px;
        height:40px;
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        <span class="material-symbols-outlined">emoji_events</span>
      </span>

      <div style="display:flex; flex-direction:column;">
        <span style="font-weight:700; font-size:18px; color:#4f46e5;">
          SmartWinnr
        </span>
        <span style="font-size:12px; color:#9ca3af;">
          Admin Dashboard
        </span>
      </div>
    </div>

    <h1 style="margin-bottom: 24px;">Welcome Back</h1>

    <label>Email</label>
    <input
      [(ngModel)]="email"
      style="width:100%; padding:12px; margin:8px 0 16px; border:1px solid #ccc; border-radius:8px;"
    />

    <label>Password</label>
    <input
      type="password"
      [(ngModel)]="password"
      style="width:100%; padding:12px; margin:8px 0 24px; border:1px solid #ccc; border-radius:8px;"
    />

    <button
      (click)="login()"
      style="
        width:100%;
        padding:12px;
        background:#4f46e5;
        color:white;
        border:none;
        border-radius:8px;
        cursor:pointer;
      "
    >
      Sign In
    </button>

    <div style="margin-top: 20px; color: #6b7280;">
      Demo Credentials:<br />
      admin@smartwinnr.com<br />
      admin123
    </div>

  </div>
</div>
  `
})
export class LoginComponent {
  email = 'admin@smartwinnr.com';
  password = 'admin123';

  constructor(private http: HttpClient) {}

  login(): void {
  if (!this.email.trim() || !this.password.trim()) {
    alert('Please enter email and password');
    return;
  }

  this.http.post<any>(
    'http://localhost:5000/api/auth/login',
    {
      email: this.email,
      password: this.password
    }
  ).subscribe({
    next: (response) => {
      const user = response.user;

      // Save full user object
      localStorage.setItem('user', JSON.stringify(user));

      // Optional shortcuts
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email);

      // Redirect
      window.location.href = '/dashboard';
    },
    error: (error) => {
      console.error('Login Error:', error);

      if (error.status === 401) {
        alert('Invalid credentials');
      } else {
        alert('Login failed');
      }
    }
  });
}
}
