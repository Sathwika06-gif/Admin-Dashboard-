import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
interface TrendPoint { date: string; value: number; }

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  revenue: number;
  totalContent: number;
  publishedContent: number;
  userGrowth?: number;
  revenueGrowth?: number;
  revenueTrend: TrendPoint[];
  signupTrend: TrendPoint[];

  roleDistribution?: {
    role: string;
    count: number;
  }[];

  recentActivities?: ActivityItem[];
}

interface BarRect  { x: number; y: number; width: number; height: number; }
interface AxisLabel { x: number; y: number; text: string; }
interface ActivityItem {
  icon: string;
  text: string;
  time: string;
}

interface RoleDistribution {
  role: string;
  count: number;
  color: string;
}
@Component({
  selector: 'app-dashboard',
  template: `

    <!-- Loading spinner -->
    <div *ngIf="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading dashboard data...</p>
    </div>

    <div *ngIf="!isLoading">

      <!-- Page header -->
      <h1 class="page-title">Dashboard</h1>
      <p class="page-sub">Welcome back — here is what is happening today.</p>

      <!-- ── KPI Cards ── -->
      <div class="kpi-grid">

        <div class="kpi-card">
          <div class="kpi-top">
            <div>
              <div class="kpi-label">TOTAL USERS</div>
              <div class="kpi-value">{{ totalUsers }}</div>
              <div class="kpi-sub">{{ activeUsers }} active</div>
            </div>
            <div class="kpi-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
          </div>
          <div class="kpi-trend" [class.positive]="userGrowth >= 0" [class.negative]="userGrowth < 0">
            {{ userGrowth >= 0 ? '↗' : '↘' }} {{ absUserGrowth }}% from last month
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div>
              <div class="kpi-label">NEW SIGNUPS</div>
              <div class="kpi-value">{{ newSignups }}</div>
              <div class="kpi-sub">Last 10 days</div>
            </div>
            <div class="kpi-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
                <line x1="12" y1="14" x2="12" y2="20"/>
                <line x1="9"  y1="17" x2="15" y2="17"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div>
              <div class="kpi-label">REVENUE</div>
              <div class="kpi-value">\${{ revenue.toLocaleString() }}</div>
              <div class="kpi-sub">Last 30 days</div>
            </div>
            <div class="kpi-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
          <div class="kpi-trend" [class.positive]="revenueGrowth >= 0" [class.negative]="revenueGrowth < 0">
            {{ revenueGrowth >= 0 ? '↗' : '↘' }} {{ absRevenueGrowth }}% from last month
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div>
              <div class="kpi-label">CONTENT ITEMS</div>
              <div class="kpi-value">{{ totalContent }}</div>
              <div class="kpi-sub">{{ publishedContent }} published</div>
            </div>
            <div class="kpi-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
          </div>
        </div>

      </div><!-- /kpi-grid -->

      <!-- ── Charts row ── -->
      <div class="charts-grid">
<!-- Recent Activity + User Roles Distribution -->
<div class="charts-grid" style="margin-top: 16px;">

  <!-- Recent Activity -->
  <div class="chart-card">
    <div class="chart-title">Recent Activity</div>
    <div class="chart-sub">Latest platform updates</div>

    <div class="activity-list">
      <div class="activity-item" *ngFor="let activity of recentActivities">
        <div class="activity-icon">{{ activity.icon }}</div>

        <div class="activity-content">
          <div class="activity-text">{{ activity.text }}</div>
          <div class="activity-time">{{ activity.time }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- User Roles Distribution -->
  <div class="chart-card">
    <div class="chart-title">User Roles</div>
    <div class="chart-sub">Distribution by role</div>

    <div class="role-list">
      <div class="role-item" *ngFor="let role of roleDistribution">
        <div class="role-top">
          <span>{{ role.role }}</span>
          <span>{{ role.count }} ({{ getRolePercentage(role.count) }}%)</span>
        </div>

        <div class="progress-bar">
          <div
            class="progress-fill"
            [style.width.%]="getRolePercentage(role.count)"
            [style.background]="role.color">
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
       <!-- Revenue Area Chart -->
<div class="chart-card">
  <div class="chart-title">Revenue (30 days)</div>
  <div class="chart-sub">Daily revenue trend</div>

  <div *ngIf="revenueTrend.length === 0" class="chart-empty">
    No revenue data
  </div>

  <svg
    *ngIf="revenueTrend.length > 0"
    [attr.viewBox]="'0 0 ' + revW + ' ' + revH"
    width="100%"
    height="220"
    style="overflow: visible; margin-top: 12px"
  >
    <defs>
      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#4f46e5" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <!-- Grid Lines -->
    <g *ngFor="let gl of revGridLines">
      <line
        [attr.x1]="revPadL"
        [attr.y1]="gl.y"
        [attr.x2]="revW - revPadR"
        [attr.y2]="gl.y"
        stroke="#e2e8f0"
        stroke-width="1"
      />
      <text
        [attr.x]="revPadL - 6"
        [attr.y]="gl.y + 4"
        text-anchor="end"
        font-size="11"
        fill="#94a3b8"
      >
        {{ gl.label }}
      </text>
    </g>

    <!-- Area Fill -->
    <polygon
      [attr.points]="revAreaPts"
      fill="url(#revGrad)"
    ></polygon>

    <!-- Revenue Line -->
 <!-- Revenue Line -->
<polyline
  [attr.points]="revLinePts"
  fill="none"
  stroke="#4f46e5"
  stroke-width="3"
  stroke-linejoin="round"
  stroke-linecap="round"
></polyline>

<!-- Interactive Points -->
<g *ngFor="let point of revenuePoints; let i = index">
  <circle
    [attr.cx]="point.x"
    [attr.cy]="point.y"
    r="5"
    fill="#4f46e5"
    stroke="#ffffff"
    stroke-width="2"
  >
    <title>
      {{ revenueTrend[i].date }} - {{ '$' + revenueTrend[i].value.toLocaleString() }}
    </title>
  </circle>
</g>

    <!-- Interactive Points -->
  <!-- Interactive Points -->
<g *ngFor="let point of revenuePoints; let i = index">
  <circle
    [attr.cx]="point.x"
    [attr.cy]="point.y"
    r="5"
    fill="#4f46e5"
    stroke="#ffffff"
    stroke-width="2"
  >
    <title>{{ revenueTrend[i].date }} - {{ '$' + revenueTrend[i].value.toLocaleString() }}</title>
  </circle>
</g>

    <!-- X Axis Labels -->
    <text
      *ngFor="let xl of revXLabels"
      [attr.x]="xl.x"
      [attr.y]="xl.y"
      text-anchor="middle"
      font-size="11"
      fill="#94a3b8"
    >
      {{ xl.text }}
    </text>
  </svg>
</div>

        <!-- Signups Bar Chart -->
        <div class="chart-card">
          <div class="chart-title">New Signups (30 days)</div>
          <div class="chart-sub">Daily user registrations</div>

          <div *ngIf="signupTrend.length === 0" class="chart-empty">No signup data available</div>

          <svg *ngIf="signupTrend.length > 0"
            [attr.viewBox]="'0 0 ' + sigW + ' ' + sigH"
            width="100%" height="220" style="overflow:visible; margin-top:12px">

            <!-- Grid lines + Y labels -->
            <g *ngFor="let gl of sigGridLines">
              <line [attr.x1]="sigPadL" [attr.y1]="gl.y"
                    [attr.x2]="sigW - sigPadR" [attr.y2]="gl.y"
                    stroke="#e2e8f0" stroke-width="1"/>
              <text [attr.x]="sigPadL - 6" [attr.y]="gl.y + 4"
                    text-anchor="end" font-size="11" fill="#94a3b8">{{ gl.label }}</text>
            </g>

            <!-- Bars -->
            <rect *ngFor="let bar of sigBars"
              [attr.x]="bar.x" [attr.y]="bar.y"
              [attr.width]="bar.width" [attr.height]="bar.height"
              fill="#22c3f3" rx="3"/>

            <!-- X-axis date labels -->
            <text *ngFor="let xl of sigXLabels"
              [attr.x]="xl.x" [attr.y]="xl.y"
              text-anchor="middle" font-size="11" fill="#94a3b8">{{ xl.text }}</text>
          </svg>
        </div>

      </div><!-- /charts-grid -->
    </div>
  `,

  styles: [`
  :host {
  display: block;
  padding: 28px;
  background: inherit;
  color: inherit;
  min-height: 100%;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* ─── Header ─── */
.page-title {
  font-size: 28px;
  font-weight: 700;
  color: inherit;
  margin-bottom: 4px;
}

.page-sub {
  font-size: 14px;
  color: inherit;
  opacity: 0.75;
  margin-bottom: 24px;
}

/* ─── Loading ─── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 16px;
  color: inherit;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #334155;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ─── KPI Cards ─── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

@media (max-width: 1000px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}

.kpi-card {
  background: inherit;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.kpi-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
}

.kpi-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  color: inherit;
  opacity: 0.7;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 36px;
  font-weight: 700;
  color: inherit;
  line-height: 1;
}

.kpi-sub {
  font-size: 13px;
  color: inherit;
  opacity: 0.75;
  margin-top: 6px;
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(79, 70, 229, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-trend {
  font-size: 13px;
  font-weight: 500;
}

.kpi-trend.positive {
  color: #10b981;
}

.kpi-trend.negative {
  color: #ef4444;
}

/* ─── Charts ─── */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 900px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: inherit;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: inherit;
}

.chart-sub {
  font-size: 12px;
  color: inherit;
  opacity: 0.7;
  margin-top: 2px;
}

.chart-empty {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  opacity: 0.7;
  font-size: 14px;
}

/* ─── Recent Activity ─── */
.activity-list {
  margin-top: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #334155;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(79, 70, 229, 0.12);
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  font-weight: 500;
  color: inherit;
}

.activity-time {
  font-size: 12px;
  color: inherit;
  opacity: 0.65;
  margin-top: 2px;
}

/* ─── Role Distribution ─── */
.role-list {
  margin-top: 18px;
}

.role-item {
  margin-bottom: 18px;
}

.role-item:last-child {
  margin-bottom: 0;
}

.role-top {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  color: inherit;
  margin-bottom: 8px;
}

.progress-bar {
  height: 10px;
  background: rgba(148, 163, 184, 0.2);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
}

 `]
})
export class DashboardComponent implements OnInit, AfterViewInit {

  // ─────────────────────────────────────────────
  // KPI VALUES
  // ─────────────────────────────────────────────
  totalUsers = 0;
  activeUsers = 0;
  newSignups = 0;
  revenue = 0;
  totalContent = 0;
  publishedContent = 0;

  userGrowth = 0;
  revenueGrowth = 0;
  absUserGrowth = '0.0';
  absRevenueGrowth = '0.0';

  isLoading = true;
getRoleColor(role: string, index: number): string {
  const roleName = (role || '').toLowerCase();

  if (roleName === 'admin') return '#4f46e5';
  if (roleName === 'moderator') return '#10b981';
  if (roleName === 'user') return '#06b6d4';

  const fallbackColors = [
    '#4f46e5',
    '#10b981',
    '#06b6d4',
    '#f59e0b',
    '#ef4444'
  ];

  return fallbackColors[index % fallbackColors.length];
}
  // ─────────────────────────────────────────────
  // DYNAMIC RECENT ACTIVITY (Loaded from API)
  // ─────────────────────────────────────────────
  recentActivities: ActivityItem[] = [];

  // ─────────────────────────────────────────────
  // DYNAMIC ROLE DISTRIBUTION (Loaded from API)
  // ─────────────────────────────────────────────
  roleDistribution: RoleDistribution[] = [];

  // Total users used to calculate percentages
  get totalRoleUsers(): number {
    return this.roleDistribution.reduce(
      (sum, item) => sum + item.count,
      0
    );
  }

  getRolePercentage(count: number): number {
    if (this.totalRoleUsers === 0) return 0;
    return Math.round((count / this.totalRoleUsers) * 100);
  }

  // ─────────────────────────────────────────────
  // REVENUE AREA CHART
  // ─────────────────────────────────────────────
  revenueTrend: TrendPoint[] = [];

  revW = 560;
  revH = 190;

  revPadL = 52;
  revPadR = 10;
  revPadT = 10;
  revPadB = 28;

  revLinePts = '';
  revAreaPts = '';

  revGridLines: { y: number; label: string }[] = [];
  revXLabels: AxisLabel[] = [];
revenuePoints: { x: number; y: number }[] = [];
  // ─────────────────────────────────────────────
  // SIGNUP BAR CHART
  // ─────────────────────────────────────────────
  signupTrend: TrendPoint[] = [];

  sigW = 500;
  sigH = 190;

  sigPadL = 40;
  sigPadR = 10;
  sigPadT = 10;
  sigPadB = 28;

  sigBars: BarRect[] = [];
  sigGridLines: { y: number; label: string }[] = [];
  sigXLabels: AxisLabel[] = [];

  constructor(private http: HttpClient) {}


ngAfterViewInit(): void {
  // Required because DashboardComponent implements AfterViewInit
}
  // ─────────────────────────────────────────────
  // COMPONENT INIT
  // ─────────────────────────────────────────────
 ngOnInit() {
  this.http
    .get<DashboardData>('http://localhost:5000/api/dashboard')
    .subscribe({
      next: (data) => {
        // ─────────────────────────────
        // KPI VALUES
        // ─────────────────────────────
        this.totalUsers = data.totalUsers || 0;
        this.activeUsers = data.activeUsers || 0;
        this.newSignups = data.newSignups || 0;
        this.revenue = data.revenue || 0;
        this.totalContent = data.totalContent || 0;
        this.publishedContent = data.publishedContent || 0;

        // ─────────────────────────────
        // CHART DATA
        // ─────────────────────────────
        this.revenueTrend =
          Array.isArray(data.revenueTrend) &&
          data.revenueTrend.length > 0
            ? data.revenueTrend
            : [];

        this.signupTrend =
          Array.isArray(data.signupTrend) &&
          data.signupTrend.length > 0
            ? data.signupTrend
            : [];

        // If signupTrend is empty but newSignups > 0,
        // create a simple 30-day chart so bars appear.
        if (
          this.signupTrend.length === 0 &&
          this.newSignups > 0
        ) {
          const today = new Date();
          const dailyValue = Math.max(
            1,
            Math.round(this.newSignups / 30)
          );

          this.signupTrend = [];

          for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);

            this.signupTrend.push({
              date: d.toISOString().slice(0, 10),
              value: dailyValue
            });
          }
        }

        // If revenueTrend is empty but revenue > 0,
        // create a simple 30-day trend so chart appears.
        if (
          this.revenueTrend.length === 0 &&
          this.revenue > 0
        ) {
          const today = new Date();
          const dailyRevenue = Math.max(
            1,
            Math.round(this.revenue / 30)
          );

          this.revenueTrend = [];

          for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);

            this.revenueTrend.push({
              date: d.toISOString().slice(0, 10),
              value: dailyRevenue
            });
          }
        }

        // ─────────────────────────────
        // GROWTH VALUES
        // ─────────────────────────────
        this.userGrowth = this.calcGrowth(
          this.signupTrend
        );

        this.revenueGrowth = this.calcGrowth(
          this.revenueTrend
        );

        this.absUserGrowth = Math.abs(
          this.userGrowth
        ).toFixed(1);

        this.absRevenueGrowth = Math.abs(
          this.revenueGrowth
        ).toFixed(1);

        // ─────────────────────────────
        // BUILD CHARTS
        // ─────────────────────────────
        this.buildRevenueChart(this.revenueTrend);
        this.buildSignupsChart(this.signupTrend);

        // ─────────────────────────────
        // RECENT ACTIVITY
        // ─────────────────────────────
        this.recentActivities =
          data.recentActivities || [];

        // ─────────────────────────────
        // ROLE DISTRIBUTION
        // ─────────────────────────────
        this.roleDistribution = (
          data.roleDistribution || []
        ).map((item, index) => ({
          role: item.role,
          count: item.count,
          color: this.getRoleColor(
            item.role,
            index
          )
        }));

        // ─────────────────────────────
        // FINISH LOADING
        // ─────────────────────────────
        this.isLoading = false;
      },

      error: (err) => {
        console.error('Dashboard API error:', err);
        this.isLoading = false;
      }
    });
}
  // ─────────────────────────────────────────────
  // LOAD USERS FROM API
  // ─────────────────────────────────────────────
  loadUsers() {
    this.http
      .get<any[]>('http://localhost:5000/api/users')
      .subscribe({
        next: (users) => {
          const userList = Array.isArray(users) ? users : [];

          // ------------------------------------
          // RECENT ACTIVITY
          // ------------------------------------
          this.recentActivities = userList
            .slice(0, 7)
            .map((user: any, index: number) => ({
              icon: this.getInitials(user.name),
              text: `${user.name} (${this.capitalize(
                user.role || 'User'
              )}) joined the platform`,
              time: this.getRelativeTime(index)
            }));

          // ------------------------------------
          // ROLE DISTRIBUTION
          // ------------------------------------
          const roleCounts: Record<string, number> = {};

          userList.forEach((user: any) => {
            const role =
              user.role && typeof user.role === 'string'
                ? this.capitalize(user.role)
                : 'User';

            roleCounts[role] = (roleCounts[role] || 0) + 1;
          });

          const colors: Record<string, string> = {
            Admin: '#4f46e5',
            Moderator: '#10b981',
            User: '#06b6d4'
          };

          this.roleDistribution = Object.keys(roleCounts).map(
            (role) => ({
              role,
              count: roleCounts[role],
              color: colors[role] || '#94a3b8'
            })
          );
        },
        error: (err) => {
          console.error('Users API error:', err);
          this.recentActivities = [];
          this.roleDistribution = [];
        }
      });
  }

  // ─────────────────────────────────────────────
  // HELPER FUNCTIONS
  // ─────────────────────────────────────────────
  getInitials(name: string): string {
    if (!name) return 'U';

    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  getRelativeTime(index: number): string {
    const labels = [
      '2 minutes ago',
      '15 minutes ago',
      '1 hour ago',
      '2 hours ago',
      'Today',
      'Today',
      'Today'
    ];

    return labels[index] || 'Today';
  }

  capitalize(value: string): string {
    if (!value) return '';
    return (
      value.charAt(0).toUpperCase() +
      value.slice(1).toLowerCase()
    );
  }

  calculateRevenueGrowth(trend: TrendPoint[]): number {
    return this.calcGrowth(trend);
  }

  calculateSignupGrowth(trend: TrendPoint[]): number {
    return this.calcGrowth(trend);
  }

  calcGrowth(trend: TrendPoint[]): number {
    if (!trend || trend.length < 2) return 0;

    const half = Math.floor(trend.length / 2);

    const previous = trend
      .slice(0, half)
      .reduce((sum, item) => sum + item.value, 0);

    const current = trend
      .slice(half)
      .reduce((sum, item) => sum + item.value, 0);

    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return parseFloat(
      (((current - previous) / previous) * 100).toFixed(1)
    );
  }

  // ─────────────────────────────────────────────
  // REVENUE CHART
  // ─────────────────────────────────────────────
  buildRevenueChart(trend: TrendPoint[]) {
    if (!trend || trend.length === 0) return;

    const chartW = this.revW - this.revPadL - this.revPadR;
    const chartH = this.revH - this.revPadT - this.revPadB;

    const maxVal = Math.max(...trend.map((d) => d.value));
    const niceMax = this.niceMax(maxVal);

    this.revGridLines = [0, 0.25, 0.5, 0.75, 1].map(
      (ratio) => {
        const val = Math.round(niceMax * ratio);
        const y =
          this.revPadT +
          chartH -
          (val / niceMax) * chartH;

        return {
          y: parseFloat(y.toFixed(1)),
          label: this.shortNum(val)
        };
      }
    );

    const pts = trend.map((p, i) => ({
      x: parseFloat(
        (
          this.revPadL +
          (i / (trend.length - 1)) * chartW
        ).toFixed(1)
      ),
      y: parseFloat(
        (
          this.revPadT +
          chartH -
          (p.value / niceMax) * chartH
        ).toFixed(1)
      )
    }));
// ADD THIS LINE HERE
this.revenuePoints = pts;
    this.revLinePts = pts
      .map((p) => `${p.x},${p.y}`)
      .join(' ');

    const baseY = this.revPadT + chartH;

    this.revAreaPts =
      `${pts[0].x},${baseY} ` +
      this.revLinePts +
      ` ${pts[pts.length - 1].x},${baseY}`;

    const xLabelY = this.revH - this.revPadB + 18;
    const midIdx = Math.floor(trend.length / 2);

    this.revXLabels = [
      {
        x: pts[0].x,
        y: xLabelY,
        text: trend[0].date.slice(5)
      },
      {
        x: pts[midIdx].x,
        y: xLabelY,
        text: trend[midIdx].date.slice(5)
      },
      {
        x: pts[pts.length - 1].x,
        y: xLabelY,
        text: trend[trend.length - 1].date.slice(5)
      }
    ];
  }

  // ─────────────────────────────────────────────
  // SIGNUPS CHART
  // ─────────────────────────────────────────────
  buildSignupsChart(trend: TrendPoint[]) {
    if (!trend || trend.length === 0) return;

    const chartW =
      this.sigW - this.sigPadL - this.sigPadR;
    const chartH =
      this.sigH - this.sigPadT - this.sigPadB;

    const maxVal =
      Math.max(...trend.map((d) => d.value)) || 1;

    const niceMax = this.niceMax(maxVal);
    const baseY = this.sigPadT + chartH;

    this.sigGridLines = [0, 0.25, 0.5, 0.75, 1].map(
      (ratio) => {
        const val = parseFloat(
          (niceMax * ratio).toFixed(2)
        );

        const y =
          this.sigPadT +
          chartH -
          (val / niceMax) * chartH;

        return {
          y: parseFloat(y.toFixed(1)),
          label: String(val)
        };
      }
    );

    const spacing = chartW / trend.length;
    const barW = Math.max(2, spacing * 0.65);

    this.sigBars = trend.map((p, i) => {
      const barH =
        (p.value / niceMax) * chartH;

      return {
        x: parseFloat(
          (
            this.sigPadL +
            i * spacing +
            (spacing - barW) / 2
          ).toFixed(1)
        ),
        y: parseFloat(
          (baseY - barH).toFixed(1)
        ),
        width: barW,
        height: Math.max(1, barH)
      };
    });

    const xLabelY = this.sigH - this.sigPadB + 18;
    const midIdx = Math.floor(trend.length / 2);

    this.sigXLabels = [
      {
        x: this.sigBars[0].x + barW / 2,
        y: xLabelY,
        text: trend[0].date.slice(5)
      },
      {
        x: this.sigBars[midIdx].x + barW / 2,
        y: xLabelY,
        text: trend[midIdx].date.slice(5)
      },
      {
        x:
          this.sigBars[trend.length - 1].x +
          barW / 2,
        y: xLabelY,
        text: trend[trend.length - 1].date.slice(5)
      }
    ];
  }

  // ─────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────
  niceMax(val: number): number {
    if (val <= 0) return 1;

    const mag = Math.pow(
      10,
      Math.floor(Math.log10(val))
    );

    for (const s of [1, 2, 2.5, 5, 10]) {
      if (s * mag >= val) {
        return s * mag;
      }
    }

    return val;
  }

  shortNum(val: number): string {
    if (val >= 1000) {
      return (
        '$' +
        (val / 1000).toFixed(
          val % 1000 === 0 ? 0 : 1
        ) +
        'k'
      );
    }

    return '$' + val;
  }
}
