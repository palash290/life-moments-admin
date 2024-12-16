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
  filteredQuestions: any;
  year: any;

  constructor(private service: SharedService, private route: Router, private rout: ActivatedRoute, private location: Location) { }

  backClicked() {
    this.location.back();
  }
  video: any;
  ngOnInit() {
    this.rout.queryParams.subscribe(params => {
      const questions = params['questions'];
      const link = params['link'];
      this.video = link;
      if (questions) {
        this.questions = JSON.parse(questions);
        this.filteredQuestions = this.questions.filter((item: { questions: string; }) => item.questions != "\n");
        console.log('this.filteredQuestions', this.filteredQuestions);
        
        this.year = this.questions[0].interview_year
        console.log(this.questions);
      } else {
        console.error('No data found');
      }
    });

    //this.getQuestions();
  }

  getOrdinalSuffix(year: number): string {
    if (year == 2) {
      return 'nd';
    } else if (year == 3) {
      return 'rd';
    } else {
      return 'th';
    }
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
