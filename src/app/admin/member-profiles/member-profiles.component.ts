import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-profiles',
  templateUrl: './member-profiles.component.html',
  styleUrl: './member-profiles.component.css'
})
export class MemberProfilesComponent {

  data: any[] = [];

  constructor(private route: Router) { }

  ngOnInit() {
    this.loadData();
  }


  loadData() {
    // Mock API call to fetch data
    this.data = [
      { id: 1, image: 'assets/img/np_pro.png', name: 'Vivian Aufderhar', displayName: 'Vivian', gender: 'M', dob: '23-3-1999', isBlocked: true },
      { id: 2, image: 'assets/img/user_img.png', name: 'Vivian Aufderhar', displayName: 'Vivian', gender: 'F', dob: '23-3-1999', isBlocked: false },
      // More data objects here
    ] // Add `checked: false` to each item
  }

  getMemberAlbum() {
    this.route.navigateByUrl(`/admin/main/sub-albums/${''}`);
  }


}
