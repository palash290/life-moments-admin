import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {

  contactForm!: FormGroup;
  loading: boolean = false;

  constructor(private route: Router, private srevice: SharedService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
  }


  initForm() {
    this.contactForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', Validators.required),
      // phoneNumber: new FormControl('', Validators.required)
    })
  }

  submitForm() {
    // window.location.href = "https://lifesmomentsapp.com/";
    // return
    this.contactForm.markAllAsTouched();
    const name = this.contactForm.value.name?.trim();

    if (!name) {
      return;
    }

    if (this.contactForm.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('name', this.contactForm.value.name);
      formURlData.set('message', this.contactForm.value.message);
      formURlData.set('email', this.contactForm.value.email);
      this.srevice.postAPI('sub-admin/add=contact-us', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.contactForm.reset()
            
            window.location.href = "https://lifesmomentsapp.com/";
            this.loading = false;
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          this.loading = false;
          if (error.error.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Something went wrong!');
          }
        }
      });
    }
  }


}
