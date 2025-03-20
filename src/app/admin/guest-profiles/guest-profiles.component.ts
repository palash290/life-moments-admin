import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-guest-profiles',
  templateUrl: './guest-profiles.component.html',
  styleUrl: './guest-profiles.component.css'
})
export class GuestProfilesComponent {

  data: any[] = [];
  totalPages: number = 0;
  searchQuery = '';

  selectedOption: any = '0';

  constructor(private route: Router, private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getSubAdmins(0);
  }

  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreData: boolean = true;
  //get-all-guestusers?page=1&limit=20&search=&filter=1'
  getSubAdmins(filter?: any) {
    // debugger
    //const id = filter ? filter : 0;
    this.service.getApi(`sub-admin/get-all-guestusers?page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}&filter=${filter}`).subscribe({
      next: resp => {
        this.data = resp.data;
        //this.loading = false;
        this.totalPages = resp.pagination.totalPages;
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

  resetAndSearch(fill: any) {
    this.currentPage = 1; // Reset to first page on search
    this.getSubAdmins(fill);
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.getSubAdmins(this.selectedOption);
  }

  nextPage() {
    if (this.hasMoreData) {
      this.currentPage++;
      this.getSubAdmins(this.selectedOption);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getSubAdmins(this.selectedOption);
    }
  }


}
