import { Component } from '@angular/core';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent {

  checkAll = false;
  selectedIds: number[] = [];
  data: any[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Mock API call to fetch data
    this.data = [
      { id: 1, name: 'Vivian Aufderhar', role: 'Super Admin', email: 'Arturo_Strosin7yahoo.com', contact: '(555) 789-0123' },
      { id: 2, name: 'John Doe', role: 'Admin', email: 'john_doe@gmail.com', contact: '(555) 123-4567' },
      // More data objects here
    ].map(item => ({ ...item, checked: false })); // Add `checked: false` to each item
  }

  // getUsers() {
  //   this.service.getApi('getdashboard').subscribe({
  //     next: (resp) => {
  //       this.data = resp.users.map(user => ({ ...user, checked: false })); // Add `checked: false` to each user
  //     },
  //     error: (error) => {
  //       console.log(error.message);
  //     }
  //   });
  // }


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


}
