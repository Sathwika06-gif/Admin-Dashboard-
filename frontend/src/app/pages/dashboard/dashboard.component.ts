import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // ← FIXED: *ngIf, *ngFor
import { HttpClient } from '@angular/common/http';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  totalSales: number;
  totalRevenue: number;
  pageViews: number;
  totalContent: number;
  publishedContent: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,  // ← ADDED
  imports: [CommonModule],  // ← FIXED: *ngIf, *ngFor
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalUsers: 0,
    activeUsers: 0,
    newSignups: 0,
    totalSales: 0,
    totalRevenue: 0,
    pageViews: 0,
    totalContent: 0,
    publishedContent: 0
  };
  
  recentActivity: RecentActivity[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = '';

    // Load user stats
    this.http.get('http://localhost:5000/api/users/stats/overview').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.stats.totalUsers = response.data.overview.totalUsers;
          this.stats.activeUsers = response.data.overview.activeUsers;
          this.stats.newSignups = response.data.overview.newUsers;
        }
      },
      error: (err) => {
        console.error('Error loading user stats:', err);
        this.loading = false;
      }
    });

    // Load analytics overview
    this.http.get('http://localhost:5000/api/analytics/overview').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.stats.totalSales = response.data.overview.totalSales || 0;
          this.stats.totalRevenue = response.data.overview.totalRevenue || 0;
          this.stats.pageViews = response.data.overview.totalPageViews || 0;
        }
      },
      error: (err) => {
        console.error('Error loading analytics:', err);
      }
    });

    // Load content stats
    this.http.get('http://localhost:5000/api/content/stats/overview').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.stats.totalContent = response.data.overview.totalContent;
          this.stats.publishedContent = response.data.overview.publishedContent;
        }
      },
      error: (err) => {
        console.error('Error loading content stats:', err);
      }
    });

    // Generate sample recent activity
    this.recentActivity = [
      {
        id: '1',
        type: 'user',
        description: 'New user registered: John Doe',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '2',
        type: 'content',
        description: 'New blog post published: "Getting Started with Analytics"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        id: '3',
        type: 'analytics',
        description: 'Peak traffic detected: 1,234 visitors',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
      },
      {
        id: '4',
        type: 'user',
        description: 'Admin user updated: Jane Smith',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
      }
    ];

    this.loading = false;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getTimeAgo(timestamp: string): string {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'user': return '👤';
      case 'content': return '📄';
      case 'analytics': return '📊';
      default: return '📋';
    }
  }
}