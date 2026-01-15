import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  name: any;
  loading: boolean = false;
  @ViewChild('closeModal') closeModal!: ElementRef;

  @Output() toggleEvent = new EventEmitter<boolean>();

  toggleMenu() {
    this.toggleEvent.emit(true);
  }

  notifications: any;

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.service.refreshSidebar$.subscribe(() => {
      this.loadNotifications();
    });
    this.loadUserProfile();
  }

  loadNotifications() {
    this.service.getApi(`sub-admin/get-admin-for-notification`).subscribe({
      next: resp => {
        this.notifications = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }
  

  loadUserProfile() {
    this.service.getApi('sub-admin/profile').subscribe({
      next: (resp) => {
        this.name = resp.profile.name;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  logout() {
    this.loading = true;
    this.service.getApi('logout').subscribe({
      next: resp => {
        this.closeModal.nativeElement.click();
        this.service.logout();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
        this.closeModal.nativeElement.click();
        this.service.logout();
      }
    });
  }

  dropdownOpen = false;

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.dropdownOpen = false;
  }

  deleteNotification(id: any) {
    const formURlData = new URLSearchParams();
    formURlData.set('id', id);
    this.service.postAPI(`sub-admin/delete-admin-for-notification-by-id`, formURlData).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.notifications = this.notifications.filter((item: any) => item.id !== id);
        } else {
          this.toastr.warning(res.message);
        }
      },
      error: (error) => {
        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    })
  }

  clearNotification() {
    this.service.getApi(`sub-admin/delete-admin-for-notification`).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.notifications = [];
        } else {
          this.toastr.warning(res.message);
        }
      },
      error: (error) => {
        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    })
  }


}
