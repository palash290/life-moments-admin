import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {

  data: any;
  feedbackDetails: any;

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getUsers();
  }

  //Pagination//
  currentPage: number = 1;
  pageSize: number = 10;
  searchQuery: any = '';
  hasMoreData: boolean = true;
  loading: boolean = false;

  getUsers(filter?: any) {
    const id = filter ? filter : '';
    //this.loading = true;
    this.service.getApi(`sub-admin/get-allfeedback?page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}&filter=${id}`).subscribe({
      next: resp => {
        //this.loading = false;
        this.data = resp.data;
        //this.totalPages = resp.pagination.totalPages;
        // this.data = resp.data.map((item: { serialNumber: any; }, index: any) => {
        //   item.serialNumber = (this.currentPage - 1) * this.pageSize + index + 1;
        //   return item;
        // });
        this.hasMoreData = resp.data.length === this.pageSize;
      },
      error: error => {
        //this.loading = false;
        console.log(error.message);
      }
    });
  }

  currentFilter: any;

  onStatusChange(event: any): void {
    //debugger
    const selectedId = event.target.value;
    this.currentPage = 1;
    this.currentFilter = selectedId;
    this.getUsers(selectedId);
  }

  // goToPage(page: number) {
  //   this.currentPage = page;
  //   this.getUsers();
  // }

  goToPage(page: number) {
    this.currentPage = page;

    localStorage.setItem('currentPage', this.currentPage.toString());

    this.getUsers();
  }

  nextPage() {
    if (this.hasMoreData) {
      this.currentPage++;
      this.getUsers(this.currentFilter);
    }
  }

  // nextPage() {
  //   if (this.hasMoreData) {
  //     this.currentPage++;
  //     localStorage.setItem('currentPage', this.currentPage.toString());
  //     this.getUsers();
  //   }
  // }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getUsers(this.currentFilter);
    }
  }
  // previousPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     localStorage.setItem('currentPage', this.currentPage.toString());
  //     this.getUsers();
  //   }
  // }

  ngOnDestroy() {
    localStorage.removeItem('currentPage');
  }

  totalPages: number = 0;

  getPaginationRange(): number[] {
    if (this.hasMoreData) {
      const start = Math.max(1, this.currentPage - 2);
      const end = start + 4; // Show 5 pages
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    return []
  }

  feedbackReview(data: any) {
    this.changeLangResp = '';
    this.feedback_response = '';
    this.feedbackDetails = data;
    this.isLanguageChange = true;
  }

  reset(){
    this.changeLangResp = '';
    this.feedback_response = '';
    this.isLanguageChange = true;
  }

  getFullStars(rating: number): number {
    return Math.floor(rating); // Get the integer part for full stars
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 !== 0; // Check if there's a half star
  }

  getEmptyStars(rating: number): number {
    return 5 - Math.ceil(rating); // Calculate remaining empty stars
  }

  btnLoader: boolean = false;
  @ViewChild('closeModal') closeModal!: ElementRef;
  message: any;

  addSendMsg(det: any) {
    // console.log(det);
    // return
    
    const currPassword = this.message.trim();

    if (!currPassword) {
      //this.toastr.warning('Passwords cannot be empty or just spaces.');
      return; // Prevent submission if passwords are empty or only spaces
    }
    if (!this.message) {
      this.toastr.success('resp.message');
      return
    }
    this.btnLoader = true;
    const formURlData = new URLSearchParams();
    formURlData.set('id', det.id);
    formURlData.set('email', det.email);
    formURlData.set('message', this.message);
    formURlData.set('feedback', det.feedback);
    formURlData.set('language_code', det.language_code);

    this.service.postAPI('sub-admin/send-feedbackresponse', formURlData.toString()).subscribe({
      next: (resp) => {
        if (resp.success == true) {
          this.toastr.success(resp.message);
          this.btnLoader = false;
          this.closeModal.nativeElement.click();
          this.getUsers();
          this.message = '';
        } else {
          this.toastr.warning(resp.message);
          this.btnLoader = false;
          this.getUsers();
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

  changeLangResp: any;
  feedback_response: any;
  isLanguageChange: boolean = true;

  changeLang(feedbackDetails: any) {
    // console.log(feedbackDetails);
    // return
    //debugger
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('feedback', feedbackDetails.feedback);
    formURlData.set('feedback_response', feedbackDetails.feedback_response);
    //return
    this.service.postAPI(`sub-admin/translate-feedbackbyid`, formURlData.toString()).subscribe({
      next: resp => {
        this.loading = false;
        this.changeLangResp = resp.data.feedback;
        this.feedback_response = resp.data.feedback_response;
        this.isLanguageChange = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  convertDateFormat(dateString: string): string {
    // debugger
    const parts = dateString?.split('-');
    if (parts?.length !== 3) {
      return '';
    }
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return `${day}/${month}/${year}`;
  }


}
