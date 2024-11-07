import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @ViewChild('closeModal') closeModal!: ElementRef;

  constructor(private service: SharedService, private toastr: ToastrService) { }

logout(){
  this.closeModal.nativeElement.click();
  this.service.logout();
}
}
