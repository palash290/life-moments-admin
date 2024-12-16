import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-member-profiles',
  templateUrl: './member-profiles.component.html',
  styleUrl: './member-profiles.component.css'
})
export class MemberProfilesComponent {

  data: any[] = [];
  searchQuery = '';
  loading: boolean = false;

  constructor(private route: Router, private service: SharedService) { }

  ngOnInit() {
    // Retrieve current page from local storage if it exists
    const storedPage = localStorage.getItem('currentPage');
    this.currentPage = storedPage ? parseInt(storedPage, 10) : 1;
    this.getSubAdmins();
  }

  //Pagination//
  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreData: boolean = true;

  getSubAdmins() {
    //this.loading = true;
    this.service.getApi(`sub-admin/get-all-users?page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}`).subscribe({
      next: resp => {
        this.data = resp.data;
        this.loading = false;

        this.data = resp.data.map((item: { serialNumber: any; }, index: any) => {
          item.serialNumber = (this.currentPage - 1) * this.pageSize + index + 1;
          return item;
        });
        this.hasMoreData = resp.data.length == this.pageSize;

      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  goToPage(page: number) {
    this.currentPage = page;

    localStorage.setItem('currentPage', this.currentPage.toString());

    this.getSubAdmins();
  }

  nextPage() {
    if (this.hasMoreData) {
      this.currentPage++;
      localStorage.setItem('currentPage', this.currentPage.toString());
      this.getSubAdmins();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      localStorage.setItem('currentPage', this.currentPage.toString());
      this.getSubAdmins();
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

  // getPaginationRange(): number[] {
  //   if (this.hasMoreData) {
  //     const range: number[] = [];

  //     // Always include page 1
  //     range.push(1);

  //     // Add intermediate pages dynamically
  //     const start = Math.max(2, this.currentPage - 1);
  //     const end = Math.min(this.currentPage + 1, this.totalPages);

  //     for (let i = start; i <= end; i++) {
  //       range.push(i);
  //     }

  //     // Include the last page if it's not already in the range
  //     if (this.totalPages > 1 && !range.includes(this.totalPages)) {
  //       range.push(this.totalPages);
  //     }

  //     return range;
  //   }
  //   return []
  // }



  getMemberAlbum(item: any) {
    this.route.navigateByUrl(`/admin/main/family-member/${item.id}/${item.email}`);
  }

  handleCheckboxChange(row: any) {
    if (row.status == 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to active this user!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.postAPI(`toggle-status/${row.id}`, null).subscribe({
            next: resp => {
              //console.log(resp)
              //this.toastr.success(resp.message);
              this.getSubAdmins();
            }
          })
        } else {
          this.getSubAdmins();
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to deactive this user!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.postAPI(`toggle-status/${row.id}`, null).subscribe({
            next: resp => {
              console.log(resp)
              //this.toastr.success(resp.message);
              this.getSubAdmins();
            }
          })
        } else {
          this.getSubAdmins();
        }
      });
    }
  }


}
