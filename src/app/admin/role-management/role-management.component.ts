import { Component } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent {

  checkAll = false;
  selectedIds: number[] = [];
  data: any[] = [];

  //Pagination//
  currentPage: number = 1;
  pageSize: number = 10;
  searchQuery: any = '';
  hasMoreData: boolean = true;

  constructor(private service: SharedService, private route: Router) { }


  ngOnInit() {
    this.getSubAdmins();
  }

  getSubAdmins() {
    this.service.getApi(`sub-admin/list-subadmin?page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}`).subscribe({
      next: resp => {
        this.data = resp.subadmins;

        this.data = resp.subadmins.map((item: { serialNumber: any; }, index: any) => {
          item.serialNumber = (this.currentPage - 1) * this.pageSize + index + 1;
          return item;
        });
        this.hasMoreData = resp.subadmins.length === this.pageSize;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.getSubAdmins();
  }

  nextPage() {
    if (this.hasMoreData) {
      this.currentPage++;
      this.getSubAdmins();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getSubAdmins();
    }
  }


  toggleAllCheckboxes() {
    this.data.forEach((item) => (item.checked = this.checkAll));
    this.updateSelectedIds();
  }

  updateSelectedIds() {
    this.selectedIds = this.data
      .filter((item) => item.checked)
      .map((item) => item.id);

    console.log('Selected IDs:', this.selectedIds);
  }

  assignRoleToMultiple() {
    if (this.selectedIds?.length > 0) {
      this.route.navigateByUrl(`/admin/main/privileges/${this.selectedIds?.length}`);
    }
  }

  assignRoleToSingle(name: any) {
    this.route.navigateByUrl(`/admin/main/privileges/${name}`);
  }


}
