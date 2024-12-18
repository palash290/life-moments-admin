import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  data: any;
  totalMembers: any;
  totalFamilies: any;
  searchQuery: string = '';
  totalRevenueGenerate: any = 13500.43;
  totalPaidUsers: any;


  constructor(private service: SharedService, private toastr: ToastrService) { }

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
              this.toastr.success(resp.message);
              this.getUsers();
            }
          })
        } else {
          this.getUsers();
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
              this.toastr.success(resp.message);
              this.getUsers();
            }
          })
        } else {
          this.getUsers();
        }
      });
    }
  }

  ngOnInit() {
    this.getUsers();
    //this.loadData();
  }

  loadData() {
    this.data = [
      { id: 1, image: 'assets/img/np_pro.png', name: 'Vivian Aufderhar', displayName: 'Vivian', gender: 'M', dob: '23-3-1999', isBlocked: true },
      { id: 2, image: 'assets/img/user_img.png', name: 'Vivian Aufderhar', displayName: 'Vivian', gender: 'F', dob: '23-3-1999', isBlocked: false },
    ]
  }

  getUsers() {
    this.service.getApi('sub-admin/dashBoard').subscribe({
      next: resp => {
        this.data = resp.data.getLatestUsers;
        this.totalMembers = resp.data.totalMembers;
        this.totalFamilies = resp.data.totalFamilies;
        this.totalPaidUsers = resp.data.totalPaidUsers;
        //debugger
        this.totalRevenueGenerate = resp.data.totalRevenueGenerate;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  // name: any;
  // email: any;
  // date: any;
  // avatar_url: any;

  // getUserById(data: any) {
  //   this.name = data.full_name;
  //   this.email = data.email;
  //   this.date = data.createdAt;
  //   this.avatar_url = data.avatar_url;
  // }


}
// "id": 301,
//                 "fullName": "Rahul Tiwari",
//                 "displayName": "Rahulll",
//                 "email": "rahutiw@gmail.com",
//                 "gender": "male",
//                 "password": "$2b$10$ujBXE6zGd8q9Y6jNDaNAsOLKvOswrwduJZ2rqKgxv4P6u.pliHP4S",
//                 "show_password": "12345678",
//                 "profile_image": "http://18.229.202.71:4000/images/1732089432767.png",
//                 "verify_user": 0,
//                 "token": "$2b$10$as10QtzoJAuchvwbbJ.Ik.38mHRF7ZW4OIp.1j3EIRpXICUn9VnW.",
//                 "act_token": "d1S6aX6c",
//                 "created_at": "2024-11-20T02:26:56.000Z",
//                 "update_at": "2024-11-20T02:26:56.000Z",
//                 "onBoardingDone": 1,
//                 "familyTrees": null,
//                 "memberInvitations": null,
//                 "birth": "20/11/2016",
//                 "alive": null,
//                 "birthUnknown": null,
//                 "memberType": null,
//                 "avatarFileName": null,
//                 "familyTreeId": 721,
//                 "invitationsReceived": null,
//                 "mainFamilyTree": null,
//                 "albums": null,
//                 "popup_status": "0",
//                 "import_media_popup": 0,
//                 "lock_me": 0,
//                 "review": null,
//                 "rating": null,
//                 "delete_status": 0,
//                 "login_date": null,
//                 "other_gender": "none"