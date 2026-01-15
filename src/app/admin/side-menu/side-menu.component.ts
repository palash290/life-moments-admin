import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {

  constructor(private router: Router, private service: SharedService) { }

  @Output() toggleEvent = new EventEmitter<boolean>();

  toggleMenu() {
    this.toggleEvent.emit(false);

  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  referHeader() {
    this.service.triggerRefresh();
  }


}
