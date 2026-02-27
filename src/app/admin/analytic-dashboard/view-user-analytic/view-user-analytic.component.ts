import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-view-user-analytic',
  templateUrl: './view-user-analytic.component.html',
  styleUrl: './view-user-analytic.component.css'
})
export class ViewUserAnalyticComponent {


  data: any[] = [];
  fromDate: any;
  toDate: any;
  topCards: any[] = [];
  journey: any[] = [];
  subscriptions: any[] = [];
  featureUsage: any[] = [];
  loading: boolean = false;
  journeyConversion: number = 0;
  user_id: any;

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

  sessionTrendChart: any = {
    series: [],
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: []
    }
  };

  constructor(private service: SharedService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.setDefaultDateRange();
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
      this.getUsers();
    });
  }

  setDefaultDateRange() {
    const today = new Date();

    // TO date = today
    this.toDate = this.formatDate(today);

    // FROM date = today - 6 days (so total 7 days including today)
    const from = new Date();
    from.setDate(today.getDate() - 6);

    this.fromDate = this.formatDate(from);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  getUsers() {
    this.loading = true;

    this.service.getApi(`analytics/dashboard?from=${this.fromDate}&to=${this.toDate}`).subscribe({
      next: (resp: any) => {

        // ================= TOP CARDS =================
        this.topCards = [
          { title: 'Total Sessions', value: resp.kpis?.totalSessions?.value || 0 },
          { title: 'Active Subscriptions', value: resp.kpis?.activeSubscriptions?.value || 0 },
          { title: 'Free Trials Started', value: resp.subscriptions?.free_trial_started || 0 },
          { title: 'Signup Completed', value: resp.journey?.signup_completed || 0 }
        ];

        // ================= USER JOURNEY =================
        this.journey = Object.keys(resp.journey || {})
          .filter(key => key !== 'overallConversion')   // ❗ remove conversion from steps
          .map((key: string) => ({
            label: this.formatLabel(key),
            value: resp.journey[key],
            percent: this.calculatePercent(resp.journey[key], resp.journey?.signup_started)
          }));

        // overall conversion
        this.journeyConversion = resp.journey?.overallConversion || 0;

        // ================= SUBSCRIPTIONS =================
        this.subscriptions = Object.keys(resp.subscriptions || {}).map((key: string) => ({
          label: this.formatLabel(key),
          value: resp.subscriptions[key]
        }));

        // ================= FEATURE USAGE =================
        this.featureUsage = Object.keys(resp.momentsActivity || {}).map((key: string) => ({
          feature: this.formatLabel(key),
          usage: resp.momentsActivity[key]
        }));

        // ================= ENGAGEMENT CHART =================
        const categories1 = Object.keys(resp.engagement || {}).map((key) => this.formatLabel(key));
        const data1 = Object.values(resp.engagement || {});

        this.engagementChart.series = [{ data: data1 }];
        this.engagementChart.xaxis = { categories: categories1 };

        // ================= SESSION TREND GRAPH =================
        // this.sessionTrend = resp.graphs?.sessionTrend || [];
        // ================= SESSION TREND GRAPH =================
        const trend = resp.graphs?.sessionTrend || [];

        const categories2 = trend.map((t: any) => this.formatDateLabel(t.date));
        const data2 = trend.map((t: any) => t.total);

        this.sessionTrendChart.series = [
          {
            name: 'Sessions',
            data: data2
          }
        ];

        this.sessionTrendChart.xaxis = {
          categories: categories2
        };


        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.toastr.error('Failed to load analytics');
      }
    });
  }

  calculatePercent(value: number, total: number): number {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  formatLabel(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  formatDateLabel(dateStr: string): string {
    if (!dateStr || dateStr.length !== 8) return '';

    const year = +dateStr.substring(0, 4);
    const month = +dateStr.substring(4, 6) - 1; // JS month is 0-based
    const day = +dateStr.substring(6, 8);

    const d = new Date(year, month, day);

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  backClicked() {
    this.router.navigateByUrl(`/admin/main/google-analytic`);
  }

}
