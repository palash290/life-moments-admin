import { Component } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-member-question',
  templateUrl: './member-question.component.html',
  styleUrl: './member-question.component.css'
})
export class MemberQuestionComponent {

  memberId: any;
  questions: any;

  constructor(private service: SharedService, private route: Router, private rout: ActivatedRoute, private location: Location) { }

  backClicked() {
    this.location.back();
  }
  video: any;
  ngOnInit() {
    //    debugger
    this.rout.queryParams.subscribe(params => {
      const questions = params['questions'];
      const link = params['link'];
      this.video = link;
      if (questions) {
        this.questions = JSON.parse(questions);
        console.log(this.questions);
      } else {
        console.error('No data found');
      }
    });

    //this.getQuestions();
  }


  // getQuestions() {
  //   const formURlData = new URLSearchParams();
  //   formURlData.set('interview_year', this.memberId);
  //   this.service.postAPI(`sub-admin/getDefaultInterviewQuestionByYearAndLanguage`, formURlData.toString()).subscribe({
  //     next: resp => {
  //       this.data = resp.data;
  //     },
  //     error: error => {
  //       console.log(error.message);
  //     }
  //   });
  // }


}
