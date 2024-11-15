import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrl: './privileges.component.css'
})
export class PrivilegesComponent {

  name: any = null;
  count: any = null;

  constructor(private route: ActivatedRoute, private service: SharedService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const paramValue = params.get('name');
      if (paramValue) {
        // Check if the value is numeric
        if (!isNaN(Number(paramValue))) {
          this.count = paramValue;
          this.name = null;
        } else {
          this.name = paramValue;
          this.count = null;
        }
      }
    });
  }


}
