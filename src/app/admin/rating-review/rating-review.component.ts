import { Component } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rating-review',
  templateUrl: './rating-review.component.html',
  styleUrl: './rating-review.component.css'
})
export class RatingReviewComponent {

  data: any;
  reviewDetails: any;

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    //this.getUsers();
    this.loadData();
  }

  loadData() {
    this.data = [
      { id: 1, image: '', name: 'Vivian Aufderhar', date: '23-3-1999', time: '23:23', rating: 2.5 },
      { id: 2, image: 'assets/img/np_pro.png', name: 'Vivian Aufderhar', date: '23-3-1999', time: '23:23', rating: 3 },
      { id: 1, image: 'assets/img/user_img.png', name: 'Vivian Aufderhar', date: '23-3-1999', time: '23:23', rating: 4.5 },
      { id: 2, image: 'assets/img/user_img.png', name: 'Vivian Aufderhar', date: '23-3-1999', time: '23:23', rating: 5.0 },
    ]
  }

  // getUsers() {
  //   this.service.getApi('getdashboard').subscribe({
  //     next: resp => {
  //       this.data = resp.users;
  //     },
  //     error: error => {
  //       console.log(error.message);
  //     }
  //   });
  // }

  viewReview(data: any) {
    this.reviewDetails = data;
  }

  getFullStars(rating: number): number {
    return Math.floor(rating); // Get the integer part for full stars
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 !== 0; // Check if there's a half star
  }

  getEmptyStars(rating: number): number {
    return 5 - Math.ceil(rating); // Calculate remaining empty stars
  }


}
