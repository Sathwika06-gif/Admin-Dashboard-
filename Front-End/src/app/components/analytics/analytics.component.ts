import { Component, OnInit } from '@angular/core';
import {
  Chart, CategoryScale, LinearScale,
  BarElement, ArcElement, Tooltip, Legend
} from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TrendPoint { date: string; value: number; }

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  revenue: number;
  totalContent: number;
  publishedContent: number;
  revenueTrend: TrendPoint[];
  signupTrend: TrendPoint[];
}

interface AxisLabel { x: number; y: number; text: string; }

@Component({
  selector: 'app-analytics',
  template: `

    <!-- Loading -->
    <div *ngIf="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading analytics data...</p>
    </div>

    <div *ngIf="!isLoading">

      <!-- ── Page Header ── -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Analytics</h1>
          
          <p class="page-sub">Platform metrics and performance trends</p>
        </div>
        <select class="range-select" [(ngModel)]="selectedRange" (ngModelChange)="onRangeChange()">
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>

      <!-- ── KPI Cards ── -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">TOTAL USERS</div>
          <div class="kpi-value">{{ totalUsers }}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">ACTIVE USERS</div>
          <div class="kpi-value">{{ activeUsers }}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">REVENUE</div>
          <div class="kpi-value">\${{ revenue.toLocaleString() }}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">CONTENT ITEMS</div>
          <div class="kpi-value">{{ totalContent }}</div>
        </div>
        <div class="kpi-card">
  <div class="kpi-label">ENGAGEMENT RATE</div>
  <div class="kpi-value">{{ engagementRate }}%</div>
</div>

<div class="kpi-card">
  <div class="kpi-label">ARPU</div>
  <div class="kpi-value">\${{ arpu }}</div>
</div>

<div class="kpi-card">
  <div class="kpi-label">PUBLISH RATE</div>
  <div class="kpi-value">{{ publishRate }}%</div>
</div>

<div class="kpi-card">
  <div class="kpi-label">INACTIVE USERS</div>
  <div class="kpi-value">{{ inactiveUsers }}</div>
</div>
      </div>

      <!-- ── Revenue Trend Chart ── -->
      <div class="chart-card">
        <div class="chart-title">Revenue Trend</div>
        <div class="chart-sub">Daily revenue over the selected period</div>

        <div *ngIf="filteredTrend.length === 0" class="chart-empty">No revenue data available</div>

        <!-- SVG chart with tooltip -->
        <div *ngIf="filteredTrend.length > 0" class="chart-wrap" (mouseleave)="hideTooltip()">

          <!-- Tooltip box -->
          <div class="tooltip-box"
            *ngIf="tooltipVisible"
            [style.left.px]="tooltipX"
            [style.top.px]="tooltipY">
            <div class="tooltip-date">{{ tooltipDate }}</div>
            <div class="tooltip-value">Revenue : \${{ tooltipValue.toLocaleString() }}</div>
          </div>

          <svg
            [attr.viewBox]="'0 0 ' + svgW + ' ' + svgH"
            width="100%"
            height="340"
            style="overflow:visible; cursor:crosshair"
            (mousemove)="onSvgMouseMove($event)"
            (mouseleave)="hideTooltip()">

            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stop-color="#4f46e5" stop-opacity="0.18"/>
                <stop offset="100%" stop-color="#4f46e5" stop-opacity="0"/>
              </linearGradient>
            </defs>

            <!-- Y-axis grid lines + labels -->
            <g *ngFor="let gl of gridLines">
              <line [attr.x1]="padL" [attr.y1]="gl.y"
                    [attr.x2]="svgW - padR" [attr.y2]="gl.y"
                    stroke="#e2e8f0" stroke-width="1"/>
              <text [attr.x]="padL - 8" [attr.y]="gl.y + 4"
                    text-anchor="end" font-size="12" fill="#94a3b8">{{ gl.label }}</text>
            </g>

            <!-- Gradient area fill -->
            <polygon [attr.points]="areaPts" fill="url(#areaGrad)"/>

            <!-- Line -->
            <polyline [attr.points]="linePts"
              fill="none" stroke="#4f46e5" stroke-width="2.5"
              stroke-linejoin="round" stroke-linecap="round"/>

            <!-- Hover vertical line -->
            <line *ngIf="tooltipVisible"
              [attr.x1]="hoverX" [attr.y1]="padT"
              [attr.x2]="hoverX" [attr.y2]="svgH - padB"
              stroke="#4f46e5" stroke-width="1.5" stroke-dasharray="4 3"/>

            <!-- Hover dot -->
            <circle *ngIf="tooltipVisible"
              [attr.cx]="hoverX" [attr.cy]="hoverDotY"
              r="5" fill="#4f46e5" stroke="white" stroke-width="2"/>

            <!-- X-axis date labels -->
            <text *ngFor="let xl of xLabels"
              [attr.x]="xl.x" [attr.y]="xl.y"
              text-anchor="middle" font-size="12" fill="#94a3b8">{{ xl.text }}</text>

          </svg>
        </div>
      </div>

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
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

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
}

/* Range Select */
.range-select {
  appearance: none;
  background: inherit;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 10px 40px 10px 14px;
  font-size: 14px;
  font-weight: 500;
  color: inherit;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  outline: none;
  width: 220px;
  height: 44px;
}

.range-select:hover {
  border-color: #4f46e5;
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
  to { transform: rotate(360deg); }
}

/* ─── KPI Cards ─── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

@media (max-width: 900px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}

.kpi-card {
  background: inherit;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.kpi-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  color: inherit;
  opacity: 0.7;
  margin-bottom: 10px;
}

.kpi-value {
  font-size: 34px;
  font-weight: 700;
  color: inherit;
  line-height: 1;
}

/* ─── Revenue Chart ─── */
.chart-card {
  background: inherit;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  margin-bottom: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: inherit;
  margin-bottom: 4px;
}

.chart-sub {
  font-size: 13px;
  color: inherit;
  opacity: 0.7;
  margin-bottom: 4px;
}

.chart-empty {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  opacity: 0.7;
  font-size: 14px;
}

/* ─── Tooltip ─── */
.chart-wrap {
  position: relative;
}

.tooltip-box {
  position: absolute;
  background: inherit;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
  pointer-events: none;
  z-index: 10;
  min-width: 160px;
  transform: translate(-50%, -110%);
}

.tooltip-date {
  font-size: 14px;
  font-weight: 600;
  color: inherit;
  margin-bottom: 4px;
}

.tooltip-value {
  font-size: 13px;
  font-weight: 600;
  color: #4f46e5;
}
  `]
})
export class AnalyticsComponent implements OnInit {

  // ── KPI values ──
  totalUsers   = 0;
  activeUsers  = 0;
  revenue      = 0;
  totalContent = 0;
engagementRate = 0;
publishRate = 0;
arpu = 0;
inactiveUsers = 0;
  isLoading = true;

  // ── Date range ──
  selectedRange = '30';
  allTrend:      TrendPoint[] = [];
  filteredTrend: TrendPoint[] = [];

  // ── SVG chart dimensions ──
  svgW = 900; svgH = 290;
  padL = 60;  padR = 20; padT = 15; padB = 35;

  // ── Computed SVG data ──
  linePts  = '';
  areaPts  = '';
  gridLines: { y: number; label: string }[] = [];
  xLabels:   AxisLabel[] = [];

  // ── Tooltip state ──
  tooltipVisible = false;
  tooltipX       = 0;
  tooltipY       = 0;
  tooltipDate    = '';
  tooltipValue   = 0;
  hoverX         = 0;
  hoverDotY      = 0;

  // Store computed points for nearest-point lookup
  private chartPts: { x: number; y: number }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<DashboardData>('http://localhost:5000/api/dashboard').subscribe({
      next: (data) => {
        this.totalUsers   = data.totalUsers;
        this.activeUsers  = data.activeUsers;
        this.revenue      = data.revenue;
        this.totalContent = data.totalContent;
this.inactiveUsers = data.totalUsers - data.activeUsers;

this.engagementRate = Math.round(
  (data.activeUsers / data.totalUsers) * 100
);

this.publishRate = Math.round(
  (data.publishedContent / data.totalContent) * 100
);

this.arpu = Math.round(
  data.revenue / data.totalUsers
);
        this.allTrend = data.revenueTrend ?? [];
        this.applyRange();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Analytics API error:', err);
        this.isLoading = false;
      }
    });
  }

  onRangeChange() {
    this.applyRange();
  }

  applyRange() {
    const days = parseInt(this.selectedRange, 10);
    this.filteredTrend = this.allTrend.slice(-days);
    this.buildChart(this.filteredTrend);
  }

  buildChart(trend: TrendPoint[]) {
    if (!trend || trend.length === 0) return;

    const chartW  = this.svgW - this.padL - this.padR;
    const chartH  = this.svgH - this.padT - this.padB;
    const maxVal  = Math.max(...trend.map(d => d.value));
    const niceMax = this.niceMax(maxVal);

    // ── Y-axis grid lines at 0, 25, 50, 75, 100% ──
    this.gridLines = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
      const val = Math.round(niceMax * ratio);
      const y   = this.padT + chartH - (val / niceMax) * chartH;
      return { y: parseFloat(y.toFixed(1)), label: this.shortNum(val) };
    });

    // ── Data points → SVG (x, y) coordinates ──
    const pts = trend.map((p, i) => ({
      x: parseFloat((this.padL + (i / (trend.length - 1)) * chartW).toFixed(1)),
      y: parseFloat((this.padT + chartH - (p.value / niceMax) * chartH).toFixed(1)),
    }));

    this.chartPts = pts;

    // Polyline for the line
    this.linePts = pts.map(p => `${p.x},${p.y}`).join(' ');

    // Polygon for gradient area (close at bottom)
    const baseY = this.padT + chartH;
    this.areaPts = `${pts[0].x},${baseY} ${this.linePts} ${pts[pts.length-1].x},${baseY}`;

    // ── X-axis date labels — show ~6 evenly spaced ──
    const xLabelY = this.svgH - this.padB + 20;
    const count   = Math.min(6, trend.length);
    this.xLabels  = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.round((i / (count - 1)) * (trend.length - 1));
      this.xLabels.push({
        x:    pts[idx].x,
        y:    xLabelY,
        text: trend[idx].date,
      });
    }
  }

  // ── Tooltip on SVG mousemove ──
  onSvgMouseMove(event: MouseEvent) {
    if (this.chartPts.length === 0) return;

    const svgEl  = event.currentTarget as SVGSVGElement;
    const rect   = svgEl.getBoundingClientRect();
    const scaleX = this.svgW / rect.width;
    const mouseX = (event.clientX - rect.left) * scaleX;

    // Find nearest data point by x distance
    let nearest = 0;
    let minDist = Infinity;
    this.chartPts.forEach((pt, i) => {
      const dist = Math.abs(pt.x - mouseX);
      if (dist < minDist) { minDist = dist; nearest = i; }
    });

    this.hoverX    = this.chartPts[nearest].x;
    this.hoverDotY = this.chartPts[nearest].y;

    // Tooltip position (in px relative to chart-wrap div)
    const scaleY    = (event.currentTarget as SVGSVGElement).getBoundingClientRect().height / this.svgH;
    this.tooltipX   = (this.hoverX / scaleX);
    this.tooltipY   = (this.hoverDotY / (this.svgH / svgEl.getBoundingClientRect().height));

    this.tooltipDate  = this.filteredTrend[nearest].date;
    this.tooltipValue = this.filteredTrend[nearest].value;
    this.tooltipVisible = true;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  niceMax(val: number): number {
    if (val <= 0) return 1;
    const mag = Math.pow(10, Math.floor(Math.log10(val)));
    for (const s of [1, 2, 2.5, 5, 10]) {
      if (s * mag >= val) return s * mag;
    }
    return val;
  }

  shortNum(val: number): string {
    if (val >= 1000) return '$' + (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'k';
    return '$' + val;
  }
}
