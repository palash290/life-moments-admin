import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-manage-subscription',
  templateUrl: './manage-subscription.component.html',
  styleUrl: './manage-subscription.component.css'
})
export class ManageSubscriptionComponent {

  data: any;
  feedbackDetails: any;

  searchQuery = '';

  //Pagination//
  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreData: boolean = true;

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.service.getApi(`sub-admin/getAllSubscription?page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}`).subscribe({
      next: resp => {
        this.data = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  btnLoaderCreateUser: boolean = false;
  userError: boolean = false;
  userPrice: any;
  @ViewChild('closeModal') closeModal!: ElementRef;

  userErrorMessage: string = '';

  editUser() {
    const priceValue = this.userPrice != null ? String(this.userPrice).trim() : '';

    if (!priceValue) {
      this.userError = true;
      this.userErrorMessage = 'Price is required.';
      return;
    }

    if (isNaN(+priceValue)) {
      this.userError = true;
      this.userErrorMessage = 'Price must be a valid number.';
      return;
    }

    if (priceValue.length > 3) {
      this.userError = true;
      this.userErrorMessage = 'Price can not be greater than 999.';
      return;
    }

    const priceNumber = parseFloat(priceValue);

    if (priceNumber < 0) {
      this.userError = true;
      this.userErrorMessage = 'Price cannot be negative.';
      return;
    }

    this.userError = false;

    this.btnLoaderCreateUser = true;
    const formData = new URLSearchParams();
    //formData.set('id', this.userId);
    formData.set('price', this.userPrice);

    this.service.postAPI('plan/allPlans', formData).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.closeModal.nativeElement.click();
          this.getUsers();
        } else {
          this.toastr.warning(resp.message);
        }
        this.btnLoaderCreateUser = false;
      },
      error: (error) => {
        this.btnLoaderCreateUser = false;
        this.toastr.error('Something went wrong.');
        console.log(error.statusText);
      }
    });
  }


}
// "plan_name": "Monthly",
// "plan_price": "4.99",
// "fullName": "S18 S",
// "displayName": "Ss18 S",
// "profile_image": "http://18.229.202.71:4000/images/1731928569810.png",
// "purchase_date": "07 - December - 2024",
// "expire_date": "07 - January - 2025",
// "sub_status": 1