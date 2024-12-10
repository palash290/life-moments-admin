import { Component } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrl: './interview.component.css'
})
export class InterviewComponent {

  data: any;

  constructor(private service: SharedService, private toastr: ToastrService, private route: Router) { }

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions() {
    this.service.getApi(`sub-admin/getDefaultInterviewYears`).subscribe({
      next: resp => {
        this.data = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getQuestionsId(id: any) {
      this.route.navigateByUrl(`/admin/main/questions/${id}`);
  }


}
