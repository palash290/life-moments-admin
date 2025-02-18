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
    this.service.getApi(`sub-admin/get-allfeedback?page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}&filter=${id}`).subscribe({
      next: resp => {
        this.data = resp.data;
        this.hasMoreData = resp.data.length === this.pageSize;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  currentFilter: any;

  onStatusChange(event: any): void {
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

  reset() {
    this.changeLangResp = '';
    this.feedback_response = '';
    this.isLanguageChange = true;
  }

  getFullStars(rating: number): number {
    return Math.floor(rating);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 !== 0;
  }

  getEmptyStars(rating: number): number {
    return 5 - Math.ceil(rating);
  }

  btnLoader: boolean = false;
  @ViewChild('closeModal') closeModal!: ElementRef;
  message: any;
  isDisabled: boolean = false

  addSendMsg(det: any) {
    const currPassword = this.message.trim();

    if (!currPassword) {
      //this.toastr.warning('Passwords cannot be empty or just spaces.');
      return;
    }

    if (!this.message) {
      this.toastr.success('resp.message');
      return
    }

    this.loading = true;
    this.isDisabled = true
    const formURlData = new URLSearchParams();
    formURlData.set('user_id', this.ticketId);
    //formURlData.set('email', det.email);
    formURlData.set('message', this.message);
    formURlData.set('admin_id', '1');
    formURlData.set('sender_id', '1');
    //formURlData.set('feedback', det.feedback);
    //formURlData.set('language_code', det.language_code);

    this.service.postAPI('sub-admin/send-feedbackresponse', formURlData.toString()).subscribe({
      next: (resp) => {
        if (resp.success == true) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.isDisabled = false;
          this.closeModal.nativeElement.click();
          this.getMessages(this.ticketId);
          this.message = '';
        } else {
          this.toastr.warning(resp.message);
          this.loading = false;
          this.isDisabled = false;
          this.getMessages(this.ticketId);
        }
      },
      error: (error) => {
        this.loading = false;
        this.isDisabled = false;
        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    });
  }

  //   addSendMsg(det: any) {
  // //debugger

  //     const currPassword = this.message.trim();

  //     if (!currPassword) {
  //       //this.toastr.warning('Passwords cannot be empty or just spaces.');
  //       return;
  //     }
  //     if (!this.message) {
  //       this.toastr.success('resp.message');
  //       return
  //     }
  //     this.btnLoader = true;
  //     // Find the last message where sender_id !== 1
  //     const lastUserMessage = det
  //       .slice()
  //       .find((msg: any) => msg.sender_id !== 1);

  //     const lastUserMessageId = lastUserMessage ? lastUserMessage.id : null;

  //     const formURlData = new URLSearchParams();
  //     formURlData.set('user_id', lastUserMessageId);

  //     this.service.postAPI('sub-admin/send-feedbackresponse', formURlData.toString()).subscribe({
  //       next: (resp) => {
  //         if (resp.success == true) {
  //           this.toastr.success(resp.message);
  //           this.btnLoader = false;
  //           this.closeModal.nativeElement.click();
  //           this.getUsers();
  //           this.message = '';
  //         } else {
  //           this.toastr.warning(resp.message);
  //           this.btnLoader = false;
  //           this.getUsers();
  //         }
  //       },
  //       error: (error) => {
  //         this.btnLoader = false;
  //         if (error.error.message) {
  //           this.toastr.error(error.error.message);
  //         } else {
  //           this.toastr.error('Something went wrong!');
  //         }
  //       }
  //     });

  //   }

  changeLangResp: any;
  feedback_response: any;
  isLanguageChange: boolean = true;

  changeLang() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    // formURlData.set('feedback', feedbackDetails.feedback);
    formURlData.set('user_id', this.ticketId);
    // formURlData.set('feedback_response', feedbackDetails.feedback_response);
    this.service.postAPI(`sub-admin/translate-feedbackbyid`, formURlData.toString()).subscribe({
      next: resp => {
        this.loading = false;
        //debugger
        //this.changeLangResp = resp.data.message;
        this.feedback_response = resp.data;
        this.isLanguageChange = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  convertDateFormat(dateString: string): string {
    const parts = dateString?.split('-');
    if (parts?.length !== 3) {
      return '';
    }
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return `${day}/${month}/${year}`;
  }


  allMessages: any;
  ticketId: any;

  openDialog(id: any) {
    //this.getMessages(id)
    setTimeout(() => this.getMessages(id), 500);
  }

  getMessages(id: any) {
    //this.loading = true;
    this.ticketId = id;

    const formURlData = new URLSearchParams();
    formURlData.set('user_id', id);

    this.service.postAPI(`sub-admin/get-feedbackbyuserid`, formURlData.toString()).subscribe({
      next: (response) => {
        this.allMessages = response.data;
        //this.loading = false;
        this.getUsers();
      },
      error: (error) => {
        //this.loading = false;
        console.log(error);
      }
    })
  }


}
