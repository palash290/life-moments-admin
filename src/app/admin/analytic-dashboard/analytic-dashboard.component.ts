import { Component } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-analytic-dashboard',
  templateUrl: './analytic-dashboard.component.html',
  styleUrl: './analytic-dashboard.component.css'
})
export class AnalyticDashboardComponent {


  fromDate: any;
  toDate: any;

  topCards: any[] = [];
  journey: any[] = [];
  subscriptions: any[] = [];
  featureUsage: any[] = [];
  loading: boolean = false;

  engagementChart: any = {
    series: [
      {
        name: 'Users',
        data: []
      }
    ],
    chart: {
      type: 'bar',
      height: 300
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 6
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: []
    }
  };

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.service.getApi('analytics/dashboard').subscribe({
      next: (resp: any) => {

        // TOP CARDS
        this.topCards = [
          { title: 'Total Users', value: resp.totalUsers || 0 },
          { title: 'App Updates', value: resp.lifecycle?.[0]?.total || 0 },
          { title: 'Total Sessions', value: resp.totalSessions || 0 },
          { title: 'Active Subscriptions', value: resp.activeSubscriptions || 0 }
        ];

        // JOURNEY (empty safe)
        this.journey = resp.journey?.map((j: any) => ({
          label: j.event_name,
          value: j.total,
          percent: j.percent || 0
        })) || [];

        // SUBSCRIPTIONS
        this.subscriptions = resp.subscriptions?.map((s: any) => ({
          label: s.event_name,
          value: s.total
        })) || [];

        // FEATURE USAGE
        this.featureUsage = resp.featureUsage?.map((f: any) => ({
          feature: f.event_name,
          usage: f.total,
          percent: f.percent || 0
        })) || [];

        // ENGAGEMENT CHART
        const categories = resp.engagement.map((e: any) => e.event_name);
        const data = resp.engagement.map((e: any) => e.total);

        this.engagementChart.series = [{ data: data }];
        this.engagementChart.xaxis = { categories: categories };
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.toastr.error('Failed to load analytics');
      }
    });
  }

}
