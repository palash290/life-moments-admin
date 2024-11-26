import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sub-admins',
  templateUrl: './sub-admins.component.html',
  styleUrl: './sub-admins.component.css'
})
export class SubAdminsComponent {

  data: any;
  adminForm!: FormGroup;
  editAdmin!: FormGroup;
  btnLoader: boolean = false;
  btnEditLoader: boolean = false;
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModal1') closeModal1!: ElementRef;
  pattern1 = "^[0-9_-]{10,12}";
  isPasswordVisible: boolean = false;

  //Pagination//
  currentPage: number = 1;
  pageSize: number = 10;
  searchQuery: any = '';
  hasMoreData: boolean = true;


  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.initForm();
    this.initUpdateForm();
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
        // if (resp.subadmins && resp.subadmins.length > 0) {
        //   this.data = resp.subadmins;
        //   this.hasMoreData = resp.subadmins.length === this.pageSize;  // Assume more data if current page is full
        // } else {
        //   this.hasMoreData = false;
        // }
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


  initForm() {
    this.adminForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.pattern(this.pattern1)]),
    })
  }

  initUpdateForm() {
    this.editAdmin = new FormGroup({
      email: new FormControl({value: this.updateDet?.email, disabled: true}, [Validators.required, Validators.email]),
      name: new FormControl(this.updateDet?.name, Validators.required),
      password: new FormControl(this.updateDet?.password, Validators.required),
      phone: new FormControl(this.updateDet?.contact_no, [Validators.required, Validators.pattern(this.pattern1)]),
    })
  }

  updateDet: any;
  updateId: any;

  patchUpdate(details: any) {
    this.updateDet = details;
    this.updateId = details.id;
    this.initUpdateForm();
  }

  addSubAdmin() {
    this.adminForm.markAllAsTouched();
    if (this.adminForm.valid) {
      this.btnLoader = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.adminForm.value.email);
      formURlData.set('name', this.adminForm.value.name);
      formURlData.set('password', this.adminForm.value.password);
      formURlData.set('contact_no', this.adminForm.value.phone);
      //formURlData.set('roll', 'Sub-admin');
      this.service.postAPI('sub-admin/add', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.btnLoader = false;
            this.closeModal.nativeElement.click();
            this.getSubAdmins();
            this.adminForm.reset();
          } else {
            this.toastr.warning(resp.message);
            this.btnLoader = false;
            this.getSubAdmins();
          }
        },
        error: (error) => {
          this.btnLoader = false;
          if (error.error.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Something went wrong!');
          }
        }
      });
    }
  }


  editSubAdmin() {
    this.editAdmin.markAllAsTouched();
    if (this.editAdmin.valid) {
      this.btnEditLoader = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.updateDet?.email);
      formURlData.set('name', this.editAdmin.value.name);
      formURlData.set('password', this.editAdmin.value.password);
      formURlData.set('contact_no', this.editAdmin.value.phone);
      formURlData.set('id', this.updateId);
      this.service.postAPI('sub-admin/update-subadminid', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.btnEditLoader = false;
            this.closeModal1.nativeElement.click();
            this.getSubAdmins();
          } else {
            this.toastr.warning(resp.message);
            this.btnEditLoader = false;
            this.getSubAdmins();
          }
        },
        error: (error) => {
          this.btnEditLoader = false;
          if (error.error.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Something went wrong!');
          }
        }
      });
    }
  }

  handleCheckboxChange(row: any) {
    if (row.status == 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to active this member!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();
          formURlData.set('id', row.id);
          formURlData.set('status', '1');
          this.service.postAPI(`sub-admin/update-statusid`, formURlData.toString()).subscribe({
            next: resp => {
              //console.log(resp)
              this.toastr.success(resp.message);
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
        text: "You want to deactive this member!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();
          formURlData.set('id', row.id);
          formURlData.set('status', '0');
          this.service.postAPI(`sub-admin/update-statusid`, formURlData.toString()).subscribe({
            next: resp => {
              console.log(resp)
              this.toastr.success(resp.message);
              this.getSubAdmins();
            }
          })
        } else {
          this.getSubAdmins();
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  @ViewChild('closeModal2') closeModal2!: ElementRef;

  btnDelLoader: boolean = false;

  deleteMember() {
    this.btnDelLoader = true;
    this.service.deleteAcc(`sub-admin/delete-subadminid?id=${this.updateId}`).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.closeModal2.nativeElement.click();
          this.getSubAdmins();
          this.btnDelLoader = false;
        } else {
          this.btnDelLoader = false;
          this.toastr.warning('Something went wrong!');
          this.getSubAdmins();
        }
      },
    });
  }


}
