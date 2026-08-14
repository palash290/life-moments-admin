import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-influencer-management',
  templateUrl: './influencer-management.component.html',
  styleUrl: './influencer-management.component.css'
})
export class InfluencerManagementComponent implements OnInit {

  data: any[] = [];
  loading: boolean = false;
  btnLoader: boolean = false;
  btnEditLoader: boolean = false;

  influencerForm!: FormGroup;
  editInfluencerForm!: FormGroup;

  searchQuery: string = '';
  statusFilter: string = '';

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  hasMoreData: boolean = true;

  updateDet: any;
  updateId: any;

  phonePattern = "^[0-9_-]{10,15}$";

  @ViewChild('closeAddModal') closeAddModal!: ElementRef;
  @ViewChild('closeEditModal') closeEditModal!: ElementRef;

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.initForm();
    this.getInfluencers();
  }

  initForm() {
    this.influencerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      number: new FormControl('', [Validators.pattern(this.phonePattern)]),
      status: new FormControl(1)
    });
  }

  initUpdateForm() {
    this.editInfluencerForm = new FormGroup({
      name: new FormControl(this.updateDet?.name || '', Validators.required),
      email: new FormControl(this.updateDet?.email || '', [Validators.required, Validators.email]),
      number: new FormControl(this.updateDet?.phone || '', [Validators.pattern(this.phonePattern)]),
      status: new FormControl(this.updateDet?.status !== undefined ? this.updateDet.status : 1)
    });
  }

  getInfluencers(showLoader: boolean = true) {
    if (showLoader) {
      this.loading = true;
    }
    let url = 'sub-admin/influencers/list';
    const params: string[] = [];
    params.push(`page=${this.currentPage}`);
    params.push(`limit=${this.pageSize}`);
    if (this.searchQuery) {
      params.push(`search=${encodeURIComponent(this.searchQuery.trim())}`);
    }
    if (this.statusFilter !== '') {
      params.push(`status=${this.statusFilter}`);
    }
    url += `?${params.join('&')}`;

    this.service.getApi(url).subscribe({
      next: resp => {
        this.loading = false;
        if (resp && resp.success) {
          this.data = resp.data || [];
          this.totalPages = resp.data.pagination?.totalPages || 0;
          this.hasMoreData = this.data.length === this.pageSize;
        } else {
          this.data = [];
          this.totalPages = 0;
          this.hasMoreData = false;
        }
      },
      error: error => {
        this.loading = false;
        console.error(error.message);
        this.toastr.error('Failed to load influencers.');
      }
    });
  }

  nextPage() {
    if (this.hasMoreData) {
      this.currentPage++;
      this.getInfluencers(false);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getInfluencers(false);
    }
  }

  resetAndSearch() {
    this.currentPage = 1;
    this.getInfluencers(false);
  }

  addInfluencer() {
    this.influencerForm.markAllAsTouched();
    if (this.influencerForm.valid) {
      this.btnLoader = true;
      const formVal = this.influencerForm.value;

      const formURlData = new URLSearchParams();
      formURlData.set('name', formVal.name);
      formURlData.set('email', formVal.email);
      formURlData.set('phone', formVal.number);
      formURlData.set('status', formVal.status);

      this.service.postAPI('sub-admin/influencers/create', formURlData.toString()).subscribe({
        next: (resp) => {
          this.btnLoader = false;
          if (resp && resp.success) {
            this.toastr.success(resp.message || 'Influencer added successfully.');
            this.closeAddModal.nativeElement.click();
            this.influencerForm.reset({ status: 1 });
            this.getInfluencers();
          } else {
            this.toastr.warning(resp.message || 'Failed to add influencer.');
          }
        },
        error: (error) => {
          this.btnLoader = false;
          if (error.error && error.error.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Something went wrong!');
          }
        }
      });
    }
  }

  fetchDetailsAndOpenEdit(row: any) {
    this.updateId = row.id;
    this.updateDet = { ...row };
    this.initUpdateForm();
  }

  updateInfluencer() {
    this.editInfluencerForm.markAllAsTouched();
    if (this.editInfluencerForm.valid) {
      this.btnEditLoader = true;
      const formVal = this.editInfluencerForm.value;
      // const payload = {
      //   id: this.updateId,
      //   name: formVal.name,
      //   email: formVal.email,
      //   number: formVal.number,
      //   status: Number(formVal.status)
      // };

      const payload = {
        name: formVal.name,
        email: formVal.email,
        phone: formVal.number,
        status: Number(formVal.status)
      };

      this.service.putJSON(`sub-admin/influencers/update/${this.updateId}`, payload).subscribe({
        next: (resp) => {
          this.btnEditLoader = false;
          if (resp && resp.success) {
            this.toastr.success(resp.message || 'Influencer updated successfully.');
            this.closeEditModal.nativeElement.click();
            this.getInfluencers();
          } else {
            this.toastr.warning(resp.message || 'Failed to update influencer.');
          }
        },
        error: (error) => {
          this.btnEditLoader = false;
          if (error.error && error.error.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Something went wrong!');
          }
        }
      });
    }
  }

  handleStatusChange(row: any) {
    const newStatus = row.status === 1 ? 0 : 1;
    const actionText = newStatus === 1 ? 'activate' : 'deactivate';

    Swal.fire({
      title: 'Are you sure?',
      text: `You want to ${actionText} this influencer!`,
      icon: newStatus === 1 ? 'success' : 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          name: row.name,
          email: row.email,
          phone: row.phone,
          status: newStatus
        };
        this.service.putJSON(`sub-admin/influencers/delete/${row.id}`, payload).subscribe({
          next: resp => {
            if (resp && resp.success) {
              this.toastr.success(resp.message || `Influencer status changed to ${actionText}d.`);
              this.getInfluencers();
            } else {
              this.toastr.warning(resp.message || 'Failed to change status.');
              this.getInfluencers();
            }
          },
          error: error => {
            this.toastr.error('Something went wrong!');
            this.getInfluencers();
          }
        });
      } else {
        this.getInfluencers();
      }
    });
  }

  deleteInfluencer(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this influencer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteAcc(`sub-admin/influencers/delete/${row.id}`).subscribe({
          next: (resp) => {
            if (resp && resp.success) {
              this.toastr.success(resp.message || 'Influencer deleted successfully.');
              this.getInfluencers();
            } else {
              this.toastr.warning(resp.message || 'Failed to delete influencer.');
            }
          },
          error: (error) => {
            if (error.error && error.error.message) {
              this.toastr.error(error.error.message);
            } else {
              this.toastr.error('Something went wrong while deleting.');
            }
          }
        });
      }
    });
  }

}
