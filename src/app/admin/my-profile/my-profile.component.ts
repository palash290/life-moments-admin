import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared/services/shared.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {

  profileForm!: FormGroup;
  userDet: any;
  userEmail: any;
  name: any;
  phone: any;
  loading: boolean = false;

  pattern1 = "^[0-9_-]{10,12}";

  constructor(private route: Router, private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.initForm();
    this.loadUserProfile();
  }

  initForm() {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl('',  [Validators.required, Validators.pattern(this.pattern1)]),
      email: new FormControl({value: this.userEmail, disabled: true}),
    });
  }

  loadUserProfile() {
    this.service.getApi('sub-admin/profile').subscribe({
      next: (resp) => {
        this.userEmail = resp.profile.email;
        this.name = resp.profile.name;
        this.phone = resp.profile.contact_no;

        this.profileForm.patchValue({
          name: this.name,
          phone: this.phone,
          email: this.userEmail,
        });

      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  onSubmit() {
    // if (this.profileForm.valid) {
    //   this.toastr.warning('Please check all the fields!');
    //   return;
    // }
    this.profileForm.markAllAsTouched();
    
    //if (this.profileForm.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('name', this.profileForm.value.name);
      formURlData.set('email', this.userEmail);
      formURlData.set('contact_no', this.profileForm.value.phone);
     
      this.service.postAPI('sub-admin/update-profile', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.service.triggerRefresh();
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          this.toastr.warning('Something went wrong.');
          console.log(error.message);
          this.loading = false;
        }
      });
    // } else {
    //   //this.loading = false;
    //   this.toastr.warning('Please check all the fields!');
    // }
  }

  
}
