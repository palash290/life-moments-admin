import { Component } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {

  data: any;
  feedbackDetails: any;

  constructor(private service: SharedService) { }

  ngOnInit() {
    this.getUsers();
    //this.loadData();
  }

  // loadData() {
  //   this.data = [
  //     { id: 1, image: '', name: 'Vivian Aufderhar', date: '23-3-1999', time: '23:23', rating: 2.5 },
  //     { id: 2, image: 'assets/img/np_pro.png', name: 'Vivian Aufderhar', date: '23-3-1999', time: '23:23', rating: 3 },
  //     { id: 1, image: 'assets/img/user_img.png', name: 'Vivian Aufderhar', date: '23-3-1999', time: '23:23', rating: 4.5 },
  //     { id: 2, image: 'assets/img/user_img.png', name: 'Vivian Aufderhar', date: '23-3-1999', time: '23:23', rating: 5.0 },
  //   ]
  // }

  getUsers() {
    this.service.getApi('sub-admin/get-allfeedback').subscribe({
      next: resp => {
        this.data = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  feedbackReview(data: any) {
    this.feedbackDetails = data;
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
// {
//   "error": false,
//   "message": "feedback retrieved successfully.",
//   "success": true,
//   "status": 200,
//   "data": [
//       {
//           "id": 30,
//           "user_id": 252,
//           "fullName": "S S3",
//           "displayName": "Ss3",
//           "create_time": "09 51 AM",
//           "created_date": "26 - 10 - 2024"
//       },
//       {
//           "id": 29,
//           "user_id": 225,
//           "fullName": "Alex Keatons",
//           "displayName": "Andrew",
//           "create_time": "02 04 PM",
//           "created_date": "25 - 10 - 2024"
//       },
//       {
//           "id": 28,
//           "user_id": 247,
//           "fullName": "User One",
//           "displayName": "One M",
//           "create_time": "10 30 AM",
//           "created_date": "25 - 10 - 2024"
//       },
//       {
//           "id": 27,
//           "user_id": 210,
//           "fullName": "Andrew Flynn",
//           "displayName": "Andrew",
//           "create_time": "11 34 AM",
//           "created_date": "17 - 10 - 2024"
//       },
//       {
//           "id": 26,
//           "user_id": 187,
//           "fullName": "Andrew Flynn",
//           "displayName": "Andrew",
//           "create_time": "12 25 PM",
//           "created_date": "01 - 10 - 2024"
//       },
//       {
//           "id": 25,
//           "user_id": 185,
//           "fullName": "Andrew Flynn",
//           "displayName": "Andrew",
//           "create_time": "02 58 PM",
//           "created_date": "30 - 09 - 2024"
//       },
//       {
//           "id": 24,
//           "user_id": 160,
//           "fullName": "Mailto Uyakk",
//           "displayName": "The Only Thing",
//           "create_time": "10 43 AM",
//           "created_date": "25 - 09 - 2024"
//       },
//       {
//           "id": 23,
//           "user_id": 160,
//           "fullName": "Mailto Uyakk",
//           "displayName": "The Only Thing",
//           "create_time": "10 36 AM",
//           "created_date": "25 - 09 - 2024"
//       },
//       {
//           "id": 22,
//           "user_id": 156,
//           "fullName": "Hahaha Hahahaha",
//           "displayName": "Nanakajaja",
//           "create_time": "06 42 AM",
//           "created_date": "25 - 09 - 2024"
//       },
//       {
//           "id": 21,
//           "user_id": 152,
//           "fullName": "Sameer Singh ",
//           "displayName": "Sameer",
//           "create_time": "08 18 AM",
//           "created_date": "24 - 09 - 2024"
//       },
//       {
//           "id": 20,
//           "user_id": 102,
//           "fullName": "Grave Test F",
//           "displayName": "Grave Test",
//           "create_time": "07 31 AM",
//           "created_date": "24 - 09 - 2024"
//       },
//       {
//           "id": 19,
//           "user_id": 151,
//           "fullName": "Haa Hee",
//           "displayName": "Haa Hee D",
//           "create_time": "05 22 AM",
//           "created_date": "24 - 09 - 2024"
//       },
//       {
//           "id": 18,
//           "user_id": 154,
//           "fullName": "New Hindi Account",
//           "displayName": "My Name",
//           "create_time": "04 43 AM",
//           "created_date": "24 - 09 - 2024"
//       },
//       {
//           "id": 17,
//           "user_id": 151,
//           "fullName": "Haa Hee",
//           "displayName": "Haa Hee D",
//           "create_time": "07 42 AM",
//           "created_date": "20 - 09 - 2024"
//       },
//       {
//           "id": 16,
//           "user_id": 120,
//           "fullName": "Final Final Rrrr",
//           "displayName": "Yuuhuuuuuuu",
//           "create_time": "02 32 PM",
//           "created_date": "30 - 08 - 2024"
//       },
//       {
//           "id": 15,
//           "user_id": 93,
//           "fullName": "Mother Hubbard",
//           "displayName": "Mother",
//           "create_time": "02 31 PM",
//           "created_date": "29 - 08 - 2024"
//       },
//       {
//           "id": 14,
//           "user_id": 35,
//           "fullName": "Alan Grave",
//           "displayName": "Alan Grave 121",
//           "create_time": "11 01 AM",
//           "created_date": "28 - 08 - 2024"
//       },
//       {
//           "id": 13,
//           "user_id": 58,
//           "fullName": "rahul",
//           "displayName": "test",
//           "create_time": "01 34 PM",
//           "created_date": "23 - 08 - 2024"
//       },
//       {
//           "id": 12,
//           "user_id": 44,
//           "fullName": "Andrew Ania",
//           "displayName": "Andrew",
//           "create_time": "05 01 AM",
//           "created_date": "18 - 08 - 2024"
//       },
//       {
//           "id": 11,
//           "user_id": 40,
//           "fullName": "Andrew  Flynn ",
//           "displayName": "Andrew",
//           "create_time": "08 38 PM",
//           "created_date": "16 - 08 - 2024"
//       },
//       {
//           "id": 10,
//           "user_id": 14,
//           "fullName": "Tim Tales Tom",
//           "displayName": "Tim😀tales😀tom",
//           "create_time": "04 44 AM",
//           "created_date": "16 - 08 - 2024"
//       },
//       {
//           "id": 9,
//           "user_id": 9,
//           "fullName": "Jim Bim",
//           "displayName": "Jimmy B",
//           "create_time": "12 21 PM",
//           "created_date": "14 - 08 - 2024"
//       },
//       {
//           "id": 8,
//           "user_id": 9,
//           "fullName": "Jim Bim",
//           "displayName": "Jimmy B",
//           "create_time": "12 21 PM",
//           "created_date": "14 - 08 - 2024"
//       },
//       {
//           "id": 7,
//           "user_id": 9,
//           "fullName": "Jim Bim",
//           "displayName": "Jimmy B",
//           "create_time": "11 57 AM",
//           "created_date": "14 - 08 - 2024"
//       },
//       {
//           "id": 6,
//           "user_id": 1,
//           "fullName": "Tom Cluster",
//           "displayName": "Tom C 100",
//           "create_time": "04 53 AM",
//           "created_date": "14 - 08 - 2024"
//       },
//       {
//           "id": 5,
//           "user_id": null,
//           "fullName": null,
//           "displayName": null,
//           "create_time": "01 27 PM",
//           "created_date": "02 - 08 - 2024"
//       },
//       {
//           "id": 4,
//           "user_id": null,
//           "fullName": null,
//           "displayName": null,
//           "create_time": "01 26 PM",
//           "created_date": "02 - 08 - 2024"
//       },
//       {
//           "id": 3,
//           "user_id": 191,
//           "fullName": "Rahaual Sidjsi",
//           "displayName": "Sadf",
//           "create_time": "10 04 AM",
//           "created_date": "01 - 08 - 2024"
//       },
//       {
//           "id": 2,
//           "user_id": 232,
//           "fullName": "Rahul Tiwari",
//           "displayName": "Rahul",
//           "create_time": "10 04 AM",
//           "created_date": "23 - 07 - 2024"
//       },
//       {
//           "id": 1,
//           "user_id": 191,
//           "fullName": "Rahaual Sidjsi",
//           "displayName": "Sadf",
//           "create_time": "08 30 AM",
//           "created_date": "23 - 07 - 2024"
//       }
//   ]
// }