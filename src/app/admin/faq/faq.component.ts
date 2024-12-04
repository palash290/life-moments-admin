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

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.initForm();
    this.initUpdateForm();
    this.getQuestions();
  }
  
  initForm() {
    this.faqForm = new FormGroup({
      question: new FormControl('', Validators.required),
      answer: new FormControl('', Validators.required)
    })
  }

  initUpdateForm() {
    this.editFaq = new FormGroup({
      question: new FormControl(this.updateDet?.question, Validators.required),
      answer: new FormControl(this.updateDet?.answer, Validators.required)
    })
  }

  updateDet: any;
  updateId: any;

  patchUpdate(details: any) {
    this.updateDet = details;
    this.updateId = details.id;
    this.initUpdateForm();
  }

  getQuestions() {
    this.service.getApi(`sub-admin/getAllFAQ`).subscribe({
      next: resp => {
        this.data = resp.data.reverse();
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  btnLoader: boolean = false;

  addSubAdmin() {
    this.faqForm.markAllAsTouched();
    const currPassword = this.faqForm.value.question?.trim();
    const newPassword = this.faqForm.value.answer?.trim();

    if (!currPassword || !newPassword) {
      //this.toastr.warning('Passwords cannot be empty or just spaces.');
      return; // Prevent submission if passwords are empty or only spaces
    }

    if (this.faqForm.valid) {
      this.btnLoader = true;
      const formURlData = new URLSearchParams();
      formURlData.set('question', this.faqForm.value.question);
      formURlData.set('answer', this.faqForm.value.answer);

      this.service.postAPI('sub-admin/addFAQ', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.btnLoader = false;
            this.closeModal.nativeElement.click();
            this.getQuestions();
            this.faqForm.reset();
          } else {
            this.toastr.warning(resp.message);
            this.btnLoader = false;
            this.getQuestions();
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
    if (this.editFaq.valid) {
      this.btnEditLoader = true;
      const formURlData = new URLSearchParams();
      formURlData.set('question', this.editFaq.value.question);
      formURlData.set('answer', this.editFaq.value.answer);
      formURlData.set('id', this.updateId);
      this.service.postAPI('sub-admin/updateFAQById', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.btnEditLoader = false;
            this.closeModal1.nativeElement.click();
            this.getQuestions();
          } else {
            this.toastr.warning(resp.message);
            this.btnEditLoader = false;
            this.getQuestions();
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
          this.getQuestions();
          this.btnDelLoader = false;
        } else {
          this.btnDelLoader = false;
          this.toastr.warning('Something went wrong!');
          this.getQuestions();
        }
      },
    });
  }


}
