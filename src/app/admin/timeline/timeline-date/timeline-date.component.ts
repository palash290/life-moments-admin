import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-timeline-date',
  templateUrl: './timeline-date.component.html',
  styleUrl: './timeline-date.component.css'
})
export class TimelineDateComponent {

  data: any;
  month: any;
  year: any;

  constructor(private route: ActivatedRoute, private service: SharedService, private location: Location, private router: Router) { }
  
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.month = params.get('month');
      this.year = params.get('year');
      console.log(this.month,this.year);
    });

    this.getSubAdmins();
  }

  getSubAdmins() {
    const formURlData = new URLSearchParams();
    formURlData.set('month', this.month);
    formURlData.set('year', this.year);
    this.service.postAPI(`sub-admin/get-timelinedate`, formURlData).subscribe({
      next: resp => {
        this.data = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getDate(date: any) {
    this.router.navigateByUrl(`/admin/main/photo-album/${date}`);
  }

  backClicked() {
    this.location.back();
  }


}
