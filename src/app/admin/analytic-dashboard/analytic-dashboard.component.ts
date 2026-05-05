import { Component } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;

@Component({
  selector: 'app-analytic-dashboard',
  templateUrl: './analytic-dashboard.component.html',
  styleUrl: './analytic-dashboard.component.css'
})
export class AnalyticDashboardComponent {

  selectedOption: any = '0';
  isHide: boolean = true;
  isUserWiseHide: boolean = true;
  data: any[] = [];
  fromDate: any;
  toDate: any;
  topCards: any[] = [];
  journey: any[] = [];
  subscriptions: any[] = [];
  featureUsage: any[] = [];
  loading: boolean = false;
  journeyConversion: number = 0;
  kpiList: any[] = [];
  screenActivity: any[] = [];
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
      type: 'bar',
      height: 300,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '40%'
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: []
    }
  };
  modalData: any;
  modalTitle: string = '';
  clickableList: string[] = ['give_it_try_(email_15)', 'free_trial_(email_16)', 'one_free_trial_(email_17)', 'one_trial_screen_(email_19)', 'trial_screen_(email_18)', 'two_trial_screen_(email_19_a)'];
  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.selectedOption = localStorage.getItem('selectedOption') || '0';
    this.setDefaultDateRange();
    this.getUsers();
    this.getSubAdmins();
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

  learnMoreCount: any;
  welcomePopupCount: any;

  getUsers() {
    this.loading = true;

    this.service.getApi(`analytics/overview?from=${this.fromDate}&to=${this.toDate}&is_hide=${this.isHide}`).subscribe({
      next: (resp: any) => {

        this.learnMoreCount = resp.learnMoreCount;
        this.welcomePopupCount = resp.welcomePopupCount;

        // ================= TOP CARDS =================
        this.topCards = [
          { title: 'Total Sessions', value: resp.kpis?.totalSessions?.value || 0 },
          { title: 'Active Subscriptions', value: resp.kpis?.activeSubscriptions?.value || 0 },
          { title: 'Free Trials Started', value: resp.subscriptions?.freeTrialStarted || 0 },
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
            eventKey: key,
            percent: Math.round((resp.journey[key] / maxJourneyValue) * 100)
          }));


        this.screenActivity = Object.keys(resp.screenActivity || {})
          .filter(key => key !== 'overallConversion')
          .map((key: string) => {
            const rawValue = resp.screenActivity[key];
            const total = (rawValue && typeof rawValue === 'object') ? (rawValue.total || 0) : (rawValue || 0);
            const dateWise = (rawValue && typeof rawValue === 'object' && rawValue.dateWise) ? rawValue.dateWise : {};

            return {
              label: this.formatLabel(key),
              value: { total, dateWise },
              eventKey: key,
              percent: Math.round((total / maxJourneyValue) * 100)
            };
          });
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

  onHideToggle() {
    this.getUsers();
  }

  onUserWiseHideToggle() {
    this.currentPage = 1;
    this.getSubAdmins(this.selectedOption);
  }

  calculatePercent(value: number, total: number): number {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  // formatLabel(key: string): string {
  //   return key
  //     .replace(/_/g, ' ')
  //     .replace(/\b\w/g, (char) => char.toUpperCase());
  // }

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

  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreData: boolean = true;
  totalPages: number = 0;
  searchQuery = '';

  getSubAdmins(filter?: any) {

    this.service.getApi(`sub-admin/get-all-users?page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}`).subscribe({
      next: resp => {
        const filteredData = this.isUserWiseHide
          ? (resp.data || []).filter((item: any) => !this.isTestEmail(item?.email))
          : (resp.data || []);

        //this.loading = false;
        this.totalPages = resp.pagination.totalPages;
        this.data = filteredData.map((item: { serialNumber: any; }, index: any) => {
          item.serialNumber = (this.currentPage - 1) * this.pageSize + index + 1;
          return item;
        });
        this.hasMoreData = resp.data.length == this.pageSize;
      },
      error: error => {
        //this.loading = false;
        console.log(error.message);
      }
    });
  }

  isTestEmail(email: string): boolean {
    const normalizedEmail = (email || '').toLowerCase();
    return normalizedEmail.includes('mailinator') || normalizedEmail.includes('yopmail');
  }

  resetAndSearch(fill: any) {
    this.currentPage = 1; // Reset to first page on search
    this.getSubAdmins(fill);
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.getSubAdmins(this.selectedOption);
    localStorage.setItem('selectedOption', this.selectedOption);
  }

  nextPage() {
    if (this.hasMoreData) {
      this.currentPage++;
      this.getSubAdmins(this.selectedOption);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getSubAdmins(this.selectedOption);
    }
  }

  formatLabel(key: string): string {
    if (!key) return '';

    return key
      // convert camelCase / PascalCase → space separated
      .replace(/([a-z])([A-Z])/g, '$1 $2')

      // replace underscore with space
      .replace(/_/g, ' ')

      // capitalize first letter of each word
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  comingSoon() {
    this.toastr.warning('Coming Soon!')
  }

  viewDetails(journeyStep: any) {
    if (!this.clickableList.includes(journeyStep.eventKey)) {
      return;
    } else {
      const eventKey = (journeyStep.eventKey || '').split('_(')[0];
      const dateWise = journeyStep?.value?.dateWise || {};
      const dates = Object.keys(dateWise).map((date) => ({
        date,
        userIds: Array.isArray(dateWise[date]) ? dateWise[date] : []
      }));

      const payload = {
        event: eventKey,
        dates
      };

      this.service.postJSON('analytics/event-emails', payload).subscribe({
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
