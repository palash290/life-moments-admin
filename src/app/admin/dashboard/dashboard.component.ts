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
  totalCounts: any;
  searchQuery: string = '';
  totalRevenue: any = 13500.43;


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
    this.loadData();
  }

  loadData() {
    this.data = [
      { id: 1, image: 'assets/img/np_pro.png', name: 'Vivian Aufderhar', displayName: 'Vivian', gender: 'M', dob: '23-3-1999', isBlocked: true },
      { id: 2, image: 'assets/img/user_img.png', name: 'Vivian Aufderhar', displayName: 'Vivian', gender: 'F', dob: '23-3-1999', isBlocked: false },
    ]
  }

  getUsers() {
    this.service.getApi('getdashboard').subscribe({
      next: resp => {
        this.data = resp.users;
        this.totalCounts = resp;
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
