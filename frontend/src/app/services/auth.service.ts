import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:5000/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // LOGIN
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  // REGISTER
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  // SAVE TOKEN
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // GET TOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // LOGOUT
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // CHECK LOGIN
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}