import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent implements OnInit {

  summary: any;
  chart: any;

  constructor(private service: AnalyticsService) {}

  ngOnInit() {
    this.service.getSummary().subscribe(res => this.summary = res);
    this.service.getCharts().subscribe(res => this.renderChart(res));
  }

  renderChart(data: any) {
    const ctx: any = document.getElementById('chart');

    new (window as any).Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Revenue',
          data: data.revenue,
          borderColor: 'blue'
        }]
      }
    });
  }
}