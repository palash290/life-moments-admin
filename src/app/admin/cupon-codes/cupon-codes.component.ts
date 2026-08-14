import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cupon-codes',
  templateUrl: './cupon-codes.component.html',
  styleUrl: './cupon-codes.component.css'
})
export class CuponCodesComponent implements OnInit {

  data: any[] = [];
  loading: boolean = false;
  btnLoader: boolean = false;
  btnEditLoader: boolean = false;
  btnDelLoader: boolean = false;

  couponForm!: FormGroup;
  editCouponForm!: FormGroup;

  searchQuery: string = '';
  statusFilter: string = '';
  discountTypeFilter: string = '';
  planFilter: string = '';

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  hasMoreData: boolean = true;

  updateDet: any;
  updateId: any;
  selectedUsage: any;
  selectedCouponCode: string = '';
  todayDate: string = '';

  plans = [
    { id: 3, name: 'Yearly' }
  ];

  @ViewChild('closeAddModal') closeAddModal!: ElementRef;
  @ViewChild('closeEditModal') closeEditModal!: ElementRef;
  @ViewChild('closeDeleteModal') closeDeleteModal!: ElementRef;

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
    this.initForm();
    this.getCoupons();
  }

  initForm() {
    this.couponForm = new FormGroup({
      code: new FormControl('', Validators.required),
      discount_type: new FormControl('percentage', Validators.required),
      discount_value: new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)]),
      discount_for: new FormControl('users', Validators.required),
      usage_limit: new FormControl('once', Validators.required),
      plan_id: new FormControl(3, Validators.required),
      valid_from: new FormControl(''),
      valid_until: new FormControl(''),
      status: new FormControl(1, Validators.required)
    });

    this.couponForm.get('discount_type')?.valueChanges.subscribe(type => {
      const valControl = this.couponForm.get('discount_value');
      if (type === 'percentage') {
        valControl?.setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
      } else {
        valControl?.setValidators([Validators.required, Validators.min(1)]);
      }
      valControl?.updateValueAndValidity();
    });

    this.couponForm.get('discount_for')?.valueChanges.subscribe(discountFor => {
      if (discountFor === 'influencers') {
        this.couponForm.get('usage_limit')?.setValue('unlimited');
      }
    });

    this.couponForm.get('valid_from')?.valueChanges.subscribe(validFrom => {
      const validUntil = this.couponForm.get('valid_until')?.value;
      if (validFrom && validUntil && validUntil < validFrom) {
        this.couponForm.get('valid_until')?.setValue('');
      }
    });
  }

  initUpdateForm() {
    const initialType = this.updateDet?.discount_type || 'percentage';
    const valValidators = initialType === 'percentage'
      ? [Validators.required, Validators.min(1), Validators.max(100)]
      : [Validators.required, Validators.min(1)];

    const initialUsageLimit = this.updateDet?.usage_type || ((this.updateDet?.usage_limit === null || this.updateDet?.usage_limit === undefined || Number(this.updateDet?.usage_limit) === 0) ? 'unlimited' : 'once');
    const initialDiscountFor = this.updateDet?.discount_for || 'users';

    this.editCouponForm = new FormGroup({
      code: new FormControl(this.updateDet?.code || '', Validators.required),
      discount_type: new FormControl(initialType, Validators.required),
      discount_value: new FormControl(this.updateDet?.discount_value || '', valValidators),
      discount_for: new FormControl({ value: initialDiscountFor, disabled: true }, Validators.required),
      usage_limit: new FormControl({ value: initialUsageLimit, disabled: true }, Validators.required),
      plan_id: new FormControl(this.updateDet?.plan_id || 3, Validators.required),
      valid_from: new FormControl(this.formatDate(this.updateDet?.valid_from)),
      valid_until: new FormControl(this.formatDate(this.updateDet?.valid_until)),
      status: new FormControl(this.updateDet?.status !== undefined ? this.updateDet.status : 1, Validators.required)
    });

    this.editCouponForm.get('discount_type')?.valueChanges.subscribe(type => {
      const valControl = this.editCouponForm.get('discount_value');
      if (type === 'percentage') {
        valControl?.setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
      } else {
        valControl?.setValidators([Validators.required, Validators.min(1)]);
      }
      valControl?.updateValueAndValidity();
    });

    this.editCouponForm.get('valid_from')?.valueChanges.subscribe(validFrom => {
      const validUntil = this.editCouponForm.get('valid_until')?.value;
      if (validFrom && validUntil && validUntil < validFrom) {
        this.editCouponForm.get('valid_until')?.setValue('');
      }
    });
  }

  getCoupons(showLoader: boolean = true) {
    if (showLoader) {
      this.loading = true;
    }
    let url = 'sub-admin/discount-coupons/list';
    const params: string[] = [];
    params.push(`page=${this.currentPage}`);
    params.push(`limit=${this.pageSize}`);
    if (this.searchQuery) {
      params.push(`search=${encodeURIComponent(this.searchQuery.trim())}`);
    }
    if (this.statusFilter !== '') {
      params.push(`status=${this.statusFilter}`);
    }
    if (this.discountTypeFilter !== '') {
      params.push(`discount_type=${this.discountTypeFilter}`);
    }
    if (this.planFilter !== '') {
      params.push(`plan_id=${this.planFilter}`);
    }
    url += `?${params.join('&')}`;

    this.service.getApi(url).subscribe({
      next: resp => {
        this.loading = false;
        if (resp && resp.success) {
          this.data = resp.data || [];
          this.totalPages = resp.pagination?.totalPages || 0;
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
        this.toastr.error('Failed to load coupons.');
      }
    });
  }

  nextPage() {
    if (this.hasMoreData) {
      this.currentPage++;
      this.getCoupons(false);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getCoupons(false);
    }
  }

  resetAndSearch() {
    this.currentPage = 1;
    this.getCoupons(false);
  }

  formatDate(dateString: any): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  }

  addCoupon() {
    this.couponForm.markAllAsTouched();
    if (this.couponForm.valid) {
      this.btnLoader = true;
      const formVal = this.couponForm.value;
      const payload = {
        code: formVal.code,
        discount_type: formVal.discount_type,
        discount_value: Number(formVal.discount_value),
        discount_for: formVal.discount_for,
        usage_type: formVal.usage_limit,
        plan_id: Number(formVal.plan_id),
        duration_months: 12,
        valid_from: formVal.valid_from ? formVal.valid_from : null,
        valid_until: formVal.valid_until ? formVal.valid_until : null,
        status: Number(formVal.status)
      };

      this.service.postJSON('sub-admin/discount-coupons/create', payload).subscribe({
        next: (resp) => {
          this.btnLoader = false;
          if (resp && resp.success) {
            this.toastr.success(resp.message || 'Coupon created successfully.');
            this.closeAddModal.nativeElement.click();
            this.couponForm.reset({ status: 1, plan_id: 3, discount_type: 'percentage', discount_for: 'users', usage_limit: 'once' });
            this.getCoupons();
          } else {
            this.toastr.warning(resp.message || 'Failed to create coupon.');
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
    this.loading = true;
    this.service.getApi(`sub-admin/discount-coupons/details/${row.id}`).subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp && resp.success) {
          this.updateDet = resp.data;
          this.initUpdateForm();
        } else {
          this.toastr.error('Failed to load coupon details.');
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error('Failed to load coupon details.');
      }
    });
  }

  updateCoupon() {
    this.editCouponForm.markAllAsTouched();
    if (this.editCouponForm.valid) {
      this.btnEditLoader = true;
      const formVal = this.editCouponForm.getRawValue();
      const payload = {
        id: this.updateId,
        code: formVal.code,
        discount_type: formVal.discount_type,
        discount_value: Number(formVal.discount_value),
        discount_for: formVal.discount_for,
        usage_type: formVal.usage_limit,
        plan_id: Number(formVal.plan_id),
        duration_months: 12,
        valid_from: formVal.valid_from ? formVal.valid_from : null,
        valid_until: formVal.valid_until ? formVal.valid_until : null,
        status: Number(formVal.status)
      };

      this.service.putJSON(`sub-admin/discount-coupons/update/${this.updateId}`, payload).subscribe({
        next: (resp) => {
          this.btnEditLoader = false;
          if (resp && resp.success) {
            this.toastr.success(resp.message || 'Coupon updated successfully.');
            this.closeEditModal.nativeElement.click();
            this.getCoupons();
          } else {
            this.toastr.warning(resp.message || 'Failed to update coupon.');
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

  patchDelete(details: any) {
    this.updateDet = details;
    this.updateId = details.id;
  }

  deleteCoupon() {
    this.btnDelLoader = true;
    this.service.deleteAcc(`sub-admin/discount-coupons/delete/${this.updateId}`).subscribe({
      next: (resp) => {
        this.btnDelLoader = false;
        if (resp && resp.success) {
          this.toastr.success(resp.message || 'Coupon deleted successfully.');
          this.closeDeleteModal.nativeElement.click();
          this.getCoupons();
        } else {
          this.toastr.warning(resp.message || 'Failed to delete coupon.');
        }
      },
      error: (error) => {
        this.btnDelLoader = false;
        this.toastr.error('Something went wrong while deleting.');
      }
    });
  }

  handleStatusChange(row: any) {
    const originalStatus = row.status;
    const newStatus = row.status === 1 ? 0 : 1;
    const actionText = newStatus === 1 ? 'activate' : 'deactivate';

    Swal.fire({
      title: 'Are you sure?',
      text: `You want to ${actionText} this coupon!`,
      icon: newStatus === 1 ? 'success' : 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          id: row.id,
          status: newStatus
        };
        this.service.patchJSON('sub-admin/discount-status', payload).subscribe({
          next: resp => {
            if (resp && resp.success) {
              this.toastr.success(resp.message || `Coupon status changed to ${actionText}d.`);
              this.getCoupons();
            } else {
              this.toastr.warning(resp.message || 'Failed to change status.');
              this.getCoupons();
            }
          },
          error: error => {
            this.toastr.error('Something went wrong!');
            this.getCoupons();
          }
        });
      } else {
        this.getCoupons();
      }
    });
  }

  viewUsageDetails(row: any) {
    this.selectedUsage = null;
    this.selectedCouponCode = row.code;
    this.loading = true;
    this.service.getApi(`sub-admin/discount-coupons/details/${row.id}`).subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp && resp.success) {
          this.selectedUsage = resp.data?.usage || { used_count: 0, unique_user_count: 0, usage_history: [] };
        } else {
          this.toastr.error('Failed to load usage details.');
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error('Failed to load usage details.');
      }
    });
  }
}
