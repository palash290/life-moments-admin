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

  constructor(private service: SharedService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.service.getApi(`analytics/landing-analytics`).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.loading = false;
          this.data = resp.data;
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


}
