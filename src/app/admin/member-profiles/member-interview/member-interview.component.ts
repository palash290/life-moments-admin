import { Component } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-interview',
  templateUrl: './member-interview.component.html',
  styleUrl: './member-interview.component.css'
})
export class MemberInterviewComponent {

  memberId: any;
  data: any;
  loading: boolean = false;

  itemId: any;
  itemEmail: any;

  constructor(private service: SharedService, private route: Router, private rout: ActivatedRoute) { }

  goBack(){
    this.route.navigateByUrl(`/admin/main/family-member/${this.itemId}/${this.itemEmail}`);
    localStorage.removeItem('itemId')
    localStorage.removeItem('itemEmail')
  }

  ngOnInit() {
    this.rout.paramMap.subscribe((params) => {
      this.memberId = params.get('memberId');
    });

    this.getQuestions();
    this.itemId = localStorage.getItem('itemId')
    this.itemEmail = localStorage.getItem('itemEmail')
  }

  getQuestions() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('member_id', this.memberId);
    this.service.postAPI(`sub-admin/getinterview`, formURlData.toString()).subscribe({
      next: resp => {
        this.data = resp.interviews;
        this.loading = false;
      },
      error: error => {
        console.log(error.message);
        this.loading = false;
      }
    });
  }

  goToQuestions(questions: any, video: any) {
    this.route.navigate(['/admin/main/member-question'], { queryParams: { questions: JSON.stringify(questions), link: video  } });
  }


}
