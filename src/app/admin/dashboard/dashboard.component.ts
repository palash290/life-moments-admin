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
  totalGuestUser: any;
  totalGuestConvertedUser: any;
  percentageOfGusetConvertedUser: any;

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

        this.totalGuestUser = resp.data.totalGuestUser;
        this.totalGuestConvertedUser = resp.data.totalGuestConvertedUser;
        this.percentageOfGusetConvertedUser = resp.data.percentageOfGusetConvertedUser;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }


}
