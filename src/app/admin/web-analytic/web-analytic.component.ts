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

}
