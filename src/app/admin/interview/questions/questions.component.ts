import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../shared/services/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {

  interview_year: any;
  data: any;
  questionForm!: FormGroup;
  editForm!: FormGroup;
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModal1') closeModal1!: ElementRef;

  constructor(private service: SharedService, private toastr: ToastrService, private route: Router, private rout: ActivatedRoute) { }

  backClicked() {
    this.route.navigateByUrl(`/admin/main/interview`);
  }

  ngOnInit() {
    this.rout.paramMap.subscribe((params) => {
      this.interview_year = params.get('iYear');
      console.log('this.interview_year', this.interview_year);
    });

    this.service.getApi('sub-admin/get-language').subscribe(response => {
      if (response.success) {
        this.languages = response.data;
        if (this.languages.length > 0) {
          this.languageId = this.languages[0].code;
        }
      }
    });

    this.initForm();
    this.initUpdateForm();
    this.getQuestions('en');
  }

  initForm() {
    this.questionForm = new FormGroup({
      question: new FormControl('', Validators.required)
    })
  }

  initUpdateForm() {
    this.editForm = new FormGroup({
      question: new FormControl(this.getQuestion(this.updateDet), Validators.required)
    })
  }

  getQuestions(lang: any) {
    const formURlData = new URLSearchParams();
    formURlData.set('interview_year', this.interview_year);
    formURlData.set('lang_code', lang);
    this.service.postAPI(`sub-admin/getDefaultInterviewQuestionByYearAndLanguage`, formURlData.toString()).subscribe({
      next: resp => {
        this.data = resp.data;
        //console.log(this.data.length);
        
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  updateDet: any;
  updateId: any;

  patchUpdate(details: any) {
    this.updateDet = details;
    this.updateId = details.id;
    this.initUpdateForm();
  }

  languages: any;
  languageId: any;

  onLanguageChange(event: any): void {
    const selectedId = event.target.value;
    const selectedCategory = this.languages.find((language: { code: any; }) => language.code == selectedId);

    //const selectedCategory = this.categories.find(category => category.id === event.value);

    if (selectedCategory) {
      this.languageId = selectedCategory.code;
      console.log('Selected Category ID:', this.languageId);
      this.getQuestions(this.languageId)
    }
  }

  // Assuming `updateDet` contains the current question object
  getQuestion(item: any): string {
    const questionKey = `questions_${this.languageId}`;
    return item ? (item[questionKey] || item.questions) : ''; // Fallback to default or empty string
  }

  btnLoader: boolean = false;

  addQuestion() {
    this.questionForm.markAllAsTouched();
    const currPassword = this.questionForm.value.question?.trim();


    if (!currPassword) {
      //this.toastr.warning('Passwords cannot be empty or just spaces.');
      return; // Prevent submission if passwords are empty or only spaces
    }

    if (this.questionForm.valid) {
      this.btnLoader = true;
      const formURlData = new URLSearchParams();
      formURlData.set('question', this.questionForm.value.question);
      formURlData.set('interview_year', this.interview_year);
      formURlData.set('lang_code', 'en,hi,es,de,fr,pt,it,ko,zh,ru,nl,ja');

      this.service.postAPI('sub-admin/addDefaultInterviewQuestionByYearAndLanguage', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.btnLoader = false;
            this.closeModal.nativeElement.click();
            this.getQuestions(this.languageId);
            this.questionForm.reset();
          } else {
            this.toastr.warning(resp.message);
            this.btnLoader = false;
            this.getQuestions(this.languageId);
          }
        },
        error: (error) => {
          this.btnLoader = false;
          if (error.error.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Something went wrong!');
          }
        }
      });
    }
  }

  btnEditLoader: boolean = false;

  editSubAdmin() {
    this.editForm.markAllAsTouched();
    if (this.editForm.valid) {
      this.btnEditLoader = true;
      const formURlData = new URLSearchParams();
      formURlData.set('question', this.editForm.value.question);
      formURlData.set('id', this.updateId);
      formURlData.set('interview_year', this.interview_year);
      formURlData.set('lang_code', 'en,hi,es,de,fr,pt,it,ko,zh,ru,nl,ja');

      this.service.postAPI('sub-admin/updateDefaultInterviewQuestionById', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.btnEditLoader = false;
            this.closeModal1.nativeElement.click();
            this.getQuestions(this.languageId);
          } else {
            this.toastr.warning(resp.message);
            this.btnEditLoader = false;
            this.getQuestions(this.languageId);
          }
        },
        error: (error) => {
          this.btnEditLoader = false;
          if (error.error.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Something went wrong!');
          }
        }
      });
    }
  }

  @ViewChild('closeModal2') closeModal2!: ElementRef;

  btnDelLoader: boolean = false;

  deleteQuestion() {
    this.btnDelLoader = true;
    this.service.deleteAcc(`sub-admin/deleteDefaultInterviewQuestionById?id=${this.updateId}`).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.closeModal2.nativeElement.click();
          this.getQuestions(this.languageId);
          this.btnDelLoader = false;
        } else {
          this.btnDelLoader = false;
          this.toastr.warning('Something went wrong!');
          this.getQuestions(this.languageId);
        }
      },
    });
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


}
