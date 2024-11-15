import { Component } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent {

  data: any;

  constructor(private service: SharedService, private route: Router) { }

  ngOnInit() {
    this.getSubAdmins();
  }

  getSubAdmins() {
    this.service.getApi(`sub-admin/get-timelineyear`).subscribe({
      next: resp => {
        this.data = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getMonths(year: any) {
    this.route.navigateByUrl(`/admin/main/timeline-month/${year}`);
  }


}
