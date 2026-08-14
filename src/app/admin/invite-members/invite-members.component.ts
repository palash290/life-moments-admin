import { Component } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invite-members',
  templateUrl: './invite-members.component.html',
  styleUrl: './invite-members.component.css'
})
export class InviteMembersComponent {

  influencersData: any[] = [];
  membersData: any[] = [];
  coupon_id: any;

  selectedType: 'influencer' | 'member' = 'influencer';
  searchQuery: string = '';
  btnLoader: boolean = false;
  loading: boolean = false;
  discount_for: string = '';

  constructor(private service: SharedService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.coupon_id = params['coupon_id'];
      this.discount_for = params['discount_for'];
      if (this.discount_for === 'users' || this.discount_for === 'user') {
        this.selectedType = 'member';
      } else if (this.discount_for === 'influencers' || this.discount_for === 'influencer') {
        this.selectedType = 'influencer';
      }
    });
    this.getInfluencers();
    this.getMembers();
  }

  getInfluencers() {
    this.loading = true;
    let url = 'sub-admin/influencers/list';
    this.service.getApi(url).subscribe({
      next: resp => {
        this.loading = false;
        if (resp && resp.success) {
          const list = resp.data || [];
          this.influencersData = list.map((item: any) => ({ ...item, isSelected: false }));
        } else {
          this.influencersData = [];
        }
      },
      error: error => {
        this.loading = false;
        console.error(error.message);
        this.toastr.error('Failed to load influencers.');
      }
    });
  }

  getMembers() {
    this.loading = true;
    let url = 'sub-admin/get-users-for-notification';
    this.service.postAPI(url, '').subscribe({
      next: resp => {
        this.loading = false;
        if (resp && resp.success) {
          const list = resp.data || [];
          this.membersData = list.map((item: any) => ({ ...item, isSelected: false }));
        } else {
          this.membersData = [];
        }
      },
      error: error => {
        this.loading = false;
        console.error(error.message);
        this.toastr.error('Failed to load members.');
      }
    });
  }

  getFilteredData() {
    const currentList = this.selectedType === 'influencer' ? this.influencersData : this.membersData;
    if (!currentList) return [];
    if (!this.searchQuery.trim()) return currentList;
    const q = this.searchQuery.toLowerCase().trim();
    if (this.selectedType === 'influencer') {
      return currentList.filter((x: any) => 
        (x.name && x.name.toLowerCase().includes(q)) || 
        (x.email && x.email.toLowerCase().includes(q)) ||
        (x.phone && x.phone.includes(q))
      );
    } else {
      return currentList.filter((x: any) => 
        (x.fullName && x.fullName.toLowerCase().includes(q)) || 
        (x.email && x.email.toLowerCase().includes(q)) || 
        (x.member_name && x.member_name.toLowerCase().includes(q))
      );
    }
  }

  isAllSelected(): boolean {
    const list = this.getFilteredData();
    if (list.length === 0) return false;
    return list.every((item: any) => item.isSelected);
  }

  toggleSelectAll(checked: boolean) {
    const list = this.getFilteredData();
    list.forEach((item: any) => item.isSelected = checked);
  }

  getSelectedCount(): number {
    const list = this.selectedType === 'influencer' ? this.influencersData : this.membersData;
    if (!list) return 0;
    return list.filter((item: any) => item.isSelected).length;
  }

  onTypeChange() {
    this.searchQuery = '';
    if (this.influencersData) {
      this.influencersData.forEach((item: any) => item.isSelected = false);
    }
    if (this.membersData) {
      this.membersData.forEach((item: any) => item.isSelected = false);
    }
  }

  sendInvites() {
    if (!this.coupon_id) {
      this.toastr.error('No coupon code found in query parameters.');
      return;
    }
    const currentList = this.selectedType === 'influencer' ? this.influencersData : this.membersData;
    const selectedUsers = currentList.filter((item: any) => item.isSelected);
    if (selectedUsers.length === 0) {
      this.toastr.warning('Please select at least one user.');
      return;
    }

    this.btnLoader = true;

    const payload: any = {
      discount_coupon_id: Number(this.coupon_id)
    };

    if (this.selectedType === 'influencer') {
      payload.discount_for = 'influencers';
      payload.influencer_ids = selectedUsers.map((x: any) => Number(x.id));
    } else {
      payload.discount_for = 'users';
      payload.user_ids = selectedUsers.map((x: any) => Number(x.user_id || x.id));
    }

    payload.discount_for = this.discount_for;

    this.service.postJSON('sub-admin/discount-coupons/send-email', payload).subscribe({
      next: (resp) => {
        this.btnLoader = false;
        if (resp && resp.success) {
          this.toastr.success(resp.message || 'Invitation emails sent successfully.');
          currentList.forEach((item: any) => item.isSelected = false);
          this.router.navigate(['/admin/main/cupon-codes']);
        } else {
          this.toastr.warning(resp.message || 'Failed to send invitations.');
        }
      },
      error: (error) => {
        this.btnLoader = false;
        if (error.error && error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong while sending invitations.');
        }
      }
    });
  }
}

