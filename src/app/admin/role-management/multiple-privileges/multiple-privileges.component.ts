import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-multiple-privileges',
  templateUrl: './multiple-privileges.component.html',
  styleUrl: './multiple-privileges.component.css'
})
export class MultiplePrivilegesComponent {

  adminLength: any;

  constructor(private router: Router, private route: ActivatedRoute, private service: SharedService) { }
  
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.adminLength = params.get('length');
    });

  }

}
