import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {

  data: any;
  faqForm!: FormGroup;
  editFaq!: FormGroup;
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModal1') closeModal1!: ElementRef;
  loading: boolean = false;

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
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
    this.faqForm = new FormGroup({
      question: new FormControl('', Validators.required),
      answer: new FormControl('', Validators.required)
    })
  }

  initUpdateForm() {
    this.editFaq = new FormGroup({
      question: new FormControl(this.getQuestion(this.updateDet), Validators.required),
      answer: new FormControl(this.getAnswer(this.updateDet), Validators.required)
    })
  }

  updateDet: any;
  updateId: any;

  patchUpdate(details: any) {
    this.updateDet = details;
    this.updateId = details.id;
    this.initUpdateForm();
  }

  getQuestions(lang: any) {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('lang_code', lang);
    this.service.postAPI(`sub-admin/getAllFAQ`, formURlData.toString()).subscribe({
      next: resp => {
        this.loading = false;
        this.data = resp.data;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  btnLoader: boolean = false;

  addSubAdmin() {
    this.faqForm.markAllAsTouched();
    const question = this.faqForm.value.question?.trim();
    const answer = this.faqForm.value.answer?.trim();

    if (!question || !answer) {
      return;
    }

    if (this.faqForm.valid) {
      this.btnLoader = true;
      const formURlData = new URLSearchParams();
      formURlData.set('question', this.faqForm.value.question);
      formURlData.set('answer', this.faqForm.value.answer);
      formURlData.set('lang_code', 'en,hi,es,de,fr,pt,it,ko,zh,ru,nl,ja');

      this.service.postAPI('sub-admin/addFAQ', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.btnLoader = false;
            this.closeModal.nativeElement.click();
            this.getQuestions(this.languageId);
            this.faqForm.reset();
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
    this.editFaq.markAllAsTouched();

    const question = this.editFaq.value.question?.trim();
    const answer = this.editFaq.value.answer?.trim();

    if (!question || !answer) {
      return;
    }

    if (this.editFaq.valid) {
      this.btnEditLoader = true;
      const formURlData = new URLSearchParams();
      formURlData.set('question', this.editFaq.value.question);
      formURlData.set('answer', this.editFaq.value.answer);
      formURlData.set('id', this.updateId);
      formURlData.set('lang_code', 'en,hi,es,de,fr,pt,it,ko,zh,ru,nl,ja');
      
      this.service.postAPI('sub-admin/updateFAQById', formURlData.toString()).subscribe({
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

  deleteMember() {
    this.btnDelLoader = true;
    this.service.deleteAcc(`sub-admin/deleteFAQById?id=${this.updateId}`).subscribe({
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
      const questionKey = `faq_question_${this.languageId}`;
      return item ? (item[questionKey] || item.faq_question) : ''; // Fallback to default or empty string
    }

    getAnswer(item: any): string {
      const questionKey = `faq_answer_${this.languageId}`;
      return item ? (item[questionKey] || item.faq_answer) : ''; // Fallback to default or empty string
    }


}
