import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../shared/services/shared.service';
declare const $: any; // To use jQuery

@Component({
  selector: 'app-manage-subscription',
  templateUrl: './manage-subscription.component.html',
  styleUrl: './manage-subscription.component.css'
})
export class ManageSubscriptionComponent {

  data: any;
  trialUsers: any;
  feedbackDetails: any;

  searchQuery = '';
  loading: boolean = false;
  //Pagination//
  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreData: boolean = true;
  selectedOption: any = 'all';

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getAllUsers('');
    this.getTrialUsers('');
  }

  getAllUsers(filter: any) {
    const id = filter ? filter : '';
    this.service.getApi(`sub-admin/getAllSubscription?page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}&filter=${id}`).subscribe({
      next: resp => {
        this.data = resp.data;
        this.totalPages = resp.pagination.totalPages;

        this.data = resp.data.map((item: { serialNumber: any; }, index: any) => {
          item.serialNumber = (this.currentPage - 1) * this.pageSize + index + 1;
          return item;
        });
        this.hasMoreData = resp.data.length == this.pageSize;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  resetAndSearch1(fil: any) {
    this.currentPage = 1; // Reset to first page on search
    this.getAllUsers(fil);
  }


  getTrialUsers(filter: any) {
    const id = filter ? filter : '';
    this.service.getApi(`sub-admin/getAllSubscriptionTrial?page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}&filter=${id}`).subscribe({
      next: resp => {
        this.trialUsers = resp.data;
        this.totalPages = resp.pagination.totalPages;

        this.trialUsers = resp.data.map((item: { serialNumber: any; }, index: any) => {
          item.serialNumber = (this.currentPage - 1) * this.pageSize + index + 1;
          return item;
        });
        this.hasMoreData = resp.data.length == this.pageSize;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  resetAndSearch2(fil: any) {
    this.currentPage = 1; // Reset to first page on search
    this.getTrialUsers(fil);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAllUsers(this.currentFilter);
    }
  }

  nextPage() {
    if (this.hasMoreData) {
      this.currentPage++;
      this.getAllUsers(this.currentFilter);
    }
  }

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
          this.getAllUsers('');
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

  currentFilter: any;

  onLanguageChange(event: any): void {
    const selectedId = event.target.value;
    this.currentPage = 1;
    this.getAllUsers(selectedId);
    this.currentFilter = selectedId;
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

    const [day, month, year] = dateString?.split(' - ');
    const formattedMonth = months[month];
    return `${day}/${formattedMonth}/${year}`;
  }

  selectedMembersId: any;
  selectedMembers: number[] = [];
  selectedPlanId: any = '';

  onOptionChange(): void {
    // Reset Select2 if switching to Individual
    if (this.selectedOption === 'Individual') {
      setTimeout(() => {
        if ($('#membersSelect').data('select2')) {
          $('#membersSelect').select2('destroy'); // Destroy previous instance if it exists
        }

        $('#membersSelect')
          .select2({
            placeholder: 'Select members',
            allowClear: true,
          })
          .on('change', (event: any) => {
            this.selectedMembers = $(event.target).val();
            const selectedIdsAsNumbers = this.selectedMembers.map((id: any) => parseInt(id, 10));
            console.log(selectedIdsAsNumbers);
            this.selectedMembersId = selectedIdsAsNumbers;
          });
      });
    }

    // If switching away from Individual, clean up Select2
    if (this.selectedOption !== 'Individual' && $('#membersSelect').data('select2')) {
      $('#membersSelect').select2('destroy');
      this.selectedPlanId = '';
    }
  }


}
