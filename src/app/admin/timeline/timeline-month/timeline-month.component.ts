import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-timeline-month',
  templateUrl: './timeline-month.component.html',
  styleUrl: './timeline-month.component.css'
})
export class TimelineMonthComponent {

  data: any;
  year: any;

  constructor(private route: ActivatedRoute, private service: SharedService, private location: Location, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.year = params.get('year');
    });

    this.getSubAdmins();
  }

  getSubAdmins() {
    const formURlData = new URLSearchParams();
    formURlData.set('year', this.year);
    this.service.postAPI(`sub-admin/get-timelinemonth`, formURlData).subscribe({
      next: resp => {
        this.data = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getMonths(month: any) {
    this.router.navigateByUrl(`/admin/main/timeline-date/${this.year}/${month}`);
  }

  backClicked() {
    this.location.back();
  }


}
