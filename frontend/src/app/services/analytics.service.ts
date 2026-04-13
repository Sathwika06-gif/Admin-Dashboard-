import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  API = 'http://localhost:5000/api/analytics';

  constructor(private http: HttpClient) {}

  getSummary() {
    return this.http.get(`${this.API}/summary`);
  }

  getCharts() {
    return this.http.get(`${this.API}/charts`);
  }
}