import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';

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
    this.getSubAdmins();
  }


  loadData() {
    // Mock API call to fetch data
    this.data = [
      { id: 1, image: 'assets/img/np_pro.png', name: 'Vivian Aufderhar', displayName: 'Vivian', gender: 'M', dob: '23-3-1999', isBlocked: true },
      { id: 2, image: 'assets/img/user_img.png', name: 'Vivian Aufderhar', displayName: 'Vivian', gender: 'F', dob: '23-3-1999', isBlocked: false },
      // More data objects here
    ] // Add `checked: false` to each item
  }

  
  getSubAdmins() {
    this.loading = true;
    this.service.getApi(`sub-admin/get-all-users`).subscribe({
      next: resp => {
        this.data = resp.data;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  getMemberAlbum(item: any) {
    this.route.navigateByUrl(`/admin/main/family-member/${item.id}/${item.email}`);
  }


}
// "id": 249,
// "fullName": "New User",
// "displayName": "One M",
// "email": "abb@abb.com",
// "gender": "female",
// "password": "$2b$10$lAwCL/IcZS4sf1DFm9ERHuT5TMS0SbdU3ZBcFYUk.8DnQQrm3ptl2",
// "show_password": "12345678",
// "profile_image": "http://18.229.202.71:4000/images/1729857595750.png",
// "verify_user": 0,
// "token": "$2b$10$wsF2bDnTNCeIR0iSM/jZiuGEdL.GPuHH94tp4yxNsiIj8g/Jba8v.",
// "act_token": "sdnInWN8",
// "created_at": "2024-10-25T06:29:15.000Z",
// "update_at": "2024-10-25T06:29:15.000Z",
// "onBoardingDone": 1,
// "familyTrees": null,
// "memberInvitations": null,
// "birth": "25/10/2015",
// "alive": null,
// "birthUnknown": null,
// "memberType": null,
// "avatarFileName": null,
// "familyTreeId": 669,
// "invitationsReceived": null,
// "mainFamilyTree": null,
// "albums": null,
// "popup_status": "0",
// "import_media_popup": 0,
// "lock_me": 0,
// "review": null,
// "rating": null,
// "delete_status": 0,
// "login_date": null,
// "other_gender": "none"