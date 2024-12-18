import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-profiles',
  templateUrl: './member-profiles.component.html',
  styleUrl: './member-profiles.component.css'
})
export class MemberProfilesComponent {

  data: any[] = [];
  searchQuery = '';
  loading: boolean = false;
  editParentForm!: FormGroup;

  constructor(private route: Router, private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    // Retrieve current page from local storage if it exists
    const storedPage = localStorage.getItem('currentPage');
    this.currentPage = storedPage ? parseInt(storedPage, 10) : 1;
    this.getSubAdmins();
    this.initEditParentForm();
  }

  initEditParentForm() {
    this.editParentForm = new FormGroup({
      image: new FormControl(null),
      name: new FormControl(this.memberDet?.fullName, [
        Validators.required,
        Validators.pattern(/^\s*\S+(?:\s+\S+)+\s*$/) // Pattern to ensure at least two words
      ]),
      dName: new FormControl(this.memberDet?.displayName, Validators.required),
      gender: new FormControl({ value: this.memberDet?.other_gender == 'none' ? this.memberDet?.gender : this.memberDet?.other_gender, disabled: true }, Validators.required),
      dob: new FormControl(this.convertDateFormat(this.memberDet?.birth), Validators.required),
    })

    this.editParentForm.get('name')?.valueChanges.subscribe((value: string) => {
      if (value) {
        const firstWord = value.split(' ')[0]; // Get the first word
        this.editParentForm.get('dName')?.setValue(firstWord, { emitEvent: false }); // Update dName without triggering its valueChanges
      }
    });

  }

  convertDateFormat(dateString: string): string {
    // debugger
    const parts = dateString?.split('/');
    if (parts?.length !== 3) {
      return '';
    }
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  memberId: any;
  memberDet: any;

  patchMember(det: any) {
    this.memberDet = det;
    console.log('this.memberDet', this.memberDet);
    
    this.memberId = det.id;
    this.initEditParentForm();
  }

  editParentProfile!: File;

  handleFileInputEditParent(event: any) {
    const file = event.target.files[0];
    const img = document.getElementById('blah2') as HTMLImageElement;

    if (img && file) {
      img.style.display = 'block';
      const reader = new FileReader();
      reader.onload = (e: any) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files?.length > 0) {
      this.editParentProfile = inputElement.files[0];
    }
  }


    addParentLoader: boolean = false;
    @ViewChild('closeModalEditParent') closeModalEditParent!: ElementRef;
  
    editParent(): void {
      this.editParentForm.markAllAsTouched();
  
      // Check for spaces in current_password and new_password
      const name = this.editParentForm.value.name?.trim();
      const dName = this.editParentForm.value.dName?.trim();
  
      if (!name || !dName) {
        return;
      }
  
      if (this.editParentForm.valid) {
        console.log('Form Values:', this.editParentForm.value);
        this.addParentLoader = true;
        const formURlData: any = new FormData();
        if (this.editParentProfile) {
          formURlData.append('avatar', this.editParentProfile);
        }
        formURlData.set('full_name', this.editParentForm.value.name);
        formURlData.set('displayName', this.editParentForm.value.dName);
        //formURlData.set('birth', this.editParentForm.value.dob);
  
        const dob = this.editParentForm.value.dob;
  
        const isDOBUnknown = this.editParentForm.get('isDOBUnknown')?.value;
        if (!isDOBUnknown) {
          if (dob) {
            const formattedDOB = this.formatDateToDDMMYYYY(dob);
            formURlData.set('birth', formattedDOB);
          }
        }
  
        formURlData.set('user_id', this.memberId);
  
        formURlData.set('onboardingDone', '1');
        formURlData.set('gender', this.memberDet?.gender);
        formURlData.set('other_gender', 'none');
        // formURlData.set('gender', this.editParentForm.value.gender);
        // if (this.editParentForm.value.gender == 'prefer-not-to-say') {
        //   formURlData.set('other_gender', 'prefer-not-to-say');
        // } else {
        //   formURlData.set('other_gender', null);
        // }
  
  
        this.service.postAPIFormData('sub-admin/updateUserProfile', formURlData).subscribe({
          next: (resp) => {
            if (resp.success) {
              this.toastr.success('Details updated successfully!');
              this.addParentLoader = false;
              this.closeModalEditParent.nativeElement.click();
              //this.parentImage1 = null;
              this.getSubAdmins();
            } else {
              this.toastr.warning(resp.message);
              this.addParentLoader = false;
              this.getSubAdmins();
            }
          },
          error: (error) => {
            this.getSubAdmins();
            this.addParentLoader = false;
            if (error.error.message) {
              this.toastr.error(error.error.message);
            } else {
              this.toastr.error('Something went wrong!');
            }
          }
        });
      } else {
        console.log('Form is invalid');
      }
    }

    formatDateToDDMMYYYY(dateString: string): string {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
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

  // nextPage() {
  //   if (this.hasMoreData) {
  //     this.currentPage++;
  //     localStorage.setItem('currentPage', this.currentPage.toString());
  //     this.getSubAdmins();
  //   }
  // }

  // previousPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     localStorage.setItem('currentPage', this.currentPage.toString());
  //     this.getSubAdmins();
  //   }
  // }

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
    debugger
    if (row.block_status == 1) {
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
          const formURlData = new URLSearchParams();
          //console.log()
          formURlData.set('id', row.id);
          formURlData.set('block_status', '0');
          this.service.postAPI(`sub-admin/updateBlockStatus`, formURlData).subscribe({
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
          const formURlData = new URLSearchParams();
          formURlData.set('id', row.id);
          formURlData.set('block_status', '1');
          this.service.postAPI(`sub-admin/updateBlockStatus`, formURlData).subscribe({
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

  userImg1: any;

  showImg(url: any) {
    this.userImg1 = url;
  }


}
