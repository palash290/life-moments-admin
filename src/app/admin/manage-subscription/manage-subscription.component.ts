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
  loading: boolean = false;
  //Pagination//
  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreData: boolean = true;

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getUsers('');
  }

  getUsers(filter: any) {
    //this.loading = true;
    this.service.getApi(`sub-admin/getAllSubscription?page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}&filter=${filter}`).subscribe({
      next: resp => {
        this.data = resp.data;
        //this.loading = false;

        this.data = resp.data.map((item: { serialNumber: any; }, index: any) => {
          item.serialNumber = (this.currentPage - 1) * this.pageSize + index + 1;
          return item;
        });
        this.hasMoreData = resp.data.length == this.pageSize;

      },
      error: error => {
        //this.loading = false;
        console.log(error.message);
      }
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getUsers('');
    }
  }

  nextPage() {
    if (this.hasMoreData) {
      this.currentPage++;
      this.getUsers('');
    }
  }

  // goToPage(page: number) {
  //   this.currentPage = page;

  //   localStorage.setItem('currentPage', this.currentPage.toString());

  //   this.getUsers('');
  // }

  // nextPage() {
  //   if (this.hasMoreData) {
  //     this.currentPage++;
  //     localStorage.setItem('currentPage', this.currentPage.toString());
  //     this.getUsers('');
  //   }
  // }

  // previousPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     localStorage.setItem('currentPage', this.currentPage.toString());
  //     this.getUsers('');
  //   }
  // }

  ngOnDestroy() {
    localStorage.removeItem('currentPage');
  }


  totalPages: number = 0;

  getPaginationRange(): number[] {
    if (this.hasMoreData) {
      const start = Math.max(1, this.currentPage - 2);
      const end = start + 1; // Show 5 pages
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    return []
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
          this.getUsers('');
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

  languages: any;
  languageId: any;

  onLanguageChange(event: any): void {
    const selectedId = event.target.value;
    this.getUsers(selectedId)
    console.log(selectedId);
  }

  formatPurchaseDate(dateString: string): string {
    const months: { [key: string]: string } = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12'
    };

    const [day, month, year] = dateString.split(' - ');
    const formattedMonth = months[month];
    return `${day}/${formattedMonth}/${year}`;
  }


}
