import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../shared/services/shared.service';
declare var bootstrap: any;
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
  kpiList: any[] = [];

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
  modalData: any;
  modalTitle: string = '';
  clickableList: string[] = ['give_it_try_(email_15)', 'free_trial_(email_16)', 'one_free_trial_(email_17)', 'one_trial_screen_(email_19)', 'trial_screen_(email_18)', 'two_trial_screen_(email_19_a)'];
  screenActivity: any[] = [];
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

    // FROM date = today - 6 days
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

  learnMoreCount: any;
  welcomePopupCount: any;

  getUsers() {
    this.loading = true;

    this.service.getApi(`analytics/user/${this.user_id}`).subscribe({
      next: (resp: any) => {

        this.learnMoreCount = resp.learnMoreCount;
        this.welcomePopupCount = resp.welcomePopupCount;

        // ================= TOP CARDS =================
        this.topCards = [
          { title: 'Total Sessions', value: resp.kpis?.totalSessions?.value || 0 },
          { title: 'Active Subscriptions', value: resp.kpis?.activeSubscriptions?.value || 0 },
          { title: 'Free Trials Started', value: resp.subscriptions?.free_trial_start || 0 },
          { title: 'Signup Completed', value: resp.journey?.signup_completed || 0 }
        ];

        // ================= USER JOURNEY =================
        // this.journey = Object.keys(resp.journey || {})
        //   .filter(key => key !== 'overallConversion')
        //   .map((key: string) => ({
        //     label: this.formatLabel(key),
        //     value: resp.journey[key],
        //     percent: this.calculatePercent(resp.journey[key], resp.journey?.signup_started)
        //   }));
        // find max value from journey to normalize %
        const journeyValues = Object.keys(resp.journey || {})
          .filter(key => key !== 'overallConversion')
          .map(key => resp.journey[key]);

        const maxJourneyValue = Math.max(...journeyValues, 1);

        // map journey
        this.journey = Object.keys(resp.journey || {})
          .filter(key => key !== 'overallConversion')
          .map((key: string) => ({
            label: this.formatLabel(key),
            value: resp.journey[key],
            percent: Math.round((resp.journey[key] / maxJourneyValue) * 100)
          }));

        this.screenActivity = Object.keys(resp.screenActivity || {})
          .filter(key => key !== 'overallConversion')
          .map((key: string) => ({
            label: this.formatLabel(key),
            value: resp.screenActivity[key],
            eventKey: key,
            percent: Math.round((resp.screenActivity[key] / maxJourneyValue) * 100)
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

        // ================= KPI CHART =================
        // const kpis = resp.kpis || {};

        // const categories = Object.keys(kpis).map(key => this.formatLabel(key));
        // const data = Object.keys(kpis).map(key => kpis[key].value);

        // this.sessionTrendChart.series = [
        //   {
        //     name: 'Count',
        //     data: data
        //   }
        // ];

        // this.sessionTrendChart.chart = {
        //   type: 'bar',
        //   height: 300,
        //   toolbar: { show: false }
        // };

        // this.sessionTrendChart.xaxis = {
        //   categories: categories
        // };
        // ================= KPI LIST (for journey section top) =================
        this.kpiList = Object.keys(resp.kpis || {}).map((key: string) => ({
          label: this.formatLabel(key),
          value: resp.kpis[key].value,
          percent: this.calculatePercent(resp.kpis[key].value, resp.kpis?.totalSessions?.value)
        }));


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
  viewDetails(journeyStep: any) {
    if (!this.clickableList.includes(journeyStep.eventKey)) {
      return;
    } else {
      this.service.getApi(`analytics/event-emails?event=${journeyStep.eventKey}&from=${this.fromDate}&to=${this.toDate}&count=${journeyStep.value}&userId=${this.user_id}`).subscribe({
        next: (resp: any) => {
          this.modalData = resp.data || [];
          this.modalTitle = journeyStep.label;
          let modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
          modal.show();
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
}
