import { Component } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-web-analytic',
  templateUrl: './web-analytic.component.html',
  styleUrl: './web-analytic.component.css'
})
export class WebAnalyticComponent {

  loading: boolean = false;
  data: any;
  scrollMax = 1;
  socialMax = 1;
  uniqueLabels = ['Mar 3', 'Mar 6', 'Mar 8', 'Mar 10'];
  uniqueSeries = [1, 2, 2, 3];
  fromDate: any;
  toDate: any;
  uniqueUsersChart: any = {
    series: [
      {
        name: 'Users',
        data: []
      }
    ],
    chart: {
      type: 'area',
      height: 240,
      toolbar: { show: false }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    colors: ['#6dbb7a'],
    xaxis: {
      categories: []
    },
    grid: {
      strokeDashArray: 4
    }
  };

  scrollDepthChart: any = {
    series: [
      {
        name: 'Users',
        data: []
      }
    ],
    chart: {
      type: 'bar',
      height: 240,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        borderRadius: 6
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: []
    }
  };

  socialClicksChart: any = {
    series: [
      {
        name: 'Clicks',
        data: []
      }
    ],
    chart: {
      type: 'bar',
      height: 240,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 6
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: []
    }
  };
  constructor(private service: SharedService) { }

  ngOnInit() {
    this.setDefaultDateRange();
    this.getUsers();
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
    this.service.getApi(`analytics/landing-analytics?from=${this.fromDate}&to=${this.toDate}`).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.loading = false;
          this.data = resp.data;
          this.scrollMax = this.getMaxValue(this.data?.scroll_depth, 'total');
          this.socialMax = this.getMaxValue(this.data?.social_clicks, 'total');
          this.updateCharts();
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    });
  }

  getMaxValue(list: any[], key: string): number {
    if (!Array.isArray(list) || list.length === 0) {
      return 1;
    }
    const max = Math.max(...list.map((item: any) => Number(item?.[key] ?? 0)));
    return max > 0 ? max : 1;
  }

  getSocialTotal(platform: string): number {
    const match = this.data?.social_clicks?.find((item: any) => item?.social_platform === platform);
    return Number(match?.total ?? 0);
  }

  getScrollWidth(total: number): string {
    const value = (Number(total ?? 0) / this.scrollMax) * 100;
    return `${Math.min(Math.max(value, 0), 100)}%`;
  }

  getSocialHeight(total: number): string {
    const value = (Number(total ?? 0) / this.socialMax) * 100;
    return `${Math.min(Math.max(value, 0), 100)}%`;
  }

  updateCharts() {
    const unique = this.getUniqueUsersSeries();
    this.uniqueUsersChart = {
      ...this.uniqueUsersChart,
      series: [{ name: 'Users', data: unique.series }],
      xaxis: { categories: unique.labels }
    };

    const scroll = Array.isArray(this.data?.scroll_depth) ? this.data.scroll_depth : [];
    const scrollLabels = scroll.map((item: any) => `${item?.percent_scrolled ?? ''}%`);
    const scrollData = scroll.map((item: any) => Number(item?.total ?? 0));
    this.scrollDepthChart = {
      ...this.scrollDepthChart,
      series: [{ name: 'Users', data: scrollData }],
      xaxis: { categories: scrollLabels }
    };

    const social = Array.isArray(this.data?.social_clicks) ? this.data.social_clicks : [];
    const socialLabels = social.map((item: any) => item?.social_platform ?? '');
    const socialData = social.map((item: any) => Number(item?.total ?? 0));
    this.socialClicksChart = {
      ...this.socialClicksChart,
      series: [{ name: 'Clicks', data: socialData }],
      xaxis: { categories: socialLabels }
    };
  }

  getUniqueUsersSeries(): { labels: string[]; series: number[] } {
    const graph =
      this.data?.unique_users_over_time ||
      this.data?.unique_users_graph ||
      this.data?.unique_users_trend;

    if (Array.isArray(graph) && graph.length > 0) {
      if (typeof graph[0] === 'number') {
        return { labels: this.uniqueLabels, series: graph.map((v: any) => Number(v ?? 0)) };
      }

      const labels = graph.map((item: any) => item?.label ?? item?.date ?? item?.day ?? item?.period ?? '');
      const series = graph.map((item: any) => Number(item?.total ?? item?.count ?? item?.value ?? 0));
      if (labels.some((label: string) => label)) {
        return { labels, series };
      }
    }

    if (graph && typeof graph === 'object' && !Array.isArray(graph)) {
      const labels = Object.keys(graph);
      const series = labels.map((key) => Number(graph[key] ?? 0));
      if (labels.length > 0) {
        return { labels, series };
      }
    }

    return { labels: this.uniqueLabels, series: this.uniqueSeries };
  }

}
