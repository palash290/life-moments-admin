import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
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

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.service.refreshSidebar$.subscribe(() => {
      this.loadUserProfile();
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


}
