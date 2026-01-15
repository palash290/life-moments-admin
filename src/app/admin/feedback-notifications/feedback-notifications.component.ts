import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feedback-notifications',
  templateUrl: './feedback-notifications.component.html',
  styleUrl: './feedback-notifications.component.css'
})
export class FeedbackNotificationsComponent {

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

    this.service.getApi(`notification/getAdminNotification`).subscribe({
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

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getUsers(this.currentFilter);
    }
  }

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
