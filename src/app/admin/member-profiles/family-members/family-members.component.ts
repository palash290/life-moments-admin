import { Component } from '@angular/core';

@Component({
  selector: 'app-family-members',
  templateUrl: './family-members.component.html',
  styleUrl: './family-members.component.css'
})
export class FamilyMembersComponent {

  data: any[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Mock API call to fetch data
    this.data = [
      { id: 1, image:'assets/img/user_img.png', name: 'Vivian Aufderhar', displayName:'Vivian', gender: 'M', dob: '23-3-1999', isBlocked: true },
      { id: 2, image:'assets/img/user_img.png', name: 'Vivian Aufderhar', displayName:'Vivian', gender: 'F', dob: '23-3-1999', isBlocked: false },
    ] 
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

}
