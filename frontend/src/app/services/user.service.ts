import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {

  API = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(this.API);
  }

  addUser(data: any) {
    return this.http.post(this.API, data);
  }
}