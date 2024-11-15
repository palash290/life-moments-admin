import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrl: './album.component.css'
})
export class AlbumComponent {

  data: any[] = [];
  checkAll = false;
  selectedIds: number[] = [];

  constructor(private route: Router, private service: SharedService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.data = [
      {
        id: 1,
        image: '',
        title: 'Image 1',
        alt: 'Image 1 description'
      },
      {
        id: 2,
        image: 'assets/img/men_user.png',
        title: 'Image 2',
        alt: 'Image 2 description'
      },
      {
        id: 3,
        image: '',
        title: 'Image 3',
        alt: 'Image 3 description'
      },
      {
        id: 4,
        image: 'assets/img/timeline_img.png',
        title: 'Image 4',
        alt: 'Image 4 description'
      },
    ].map(item => ({ ...item, checked: false }));
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

  toggleAllCheckboxes() {
    this.data.forEach((item) => (item.checked = this.checkAll));
    this.updateSelectedIds();
  }

  updateSelectedIds() {
    this.selectedIds = this.data
      .filter((item) => item.checked)
      .map((item) => item.id);
  }

  getSelectedIds() {
    const selectedIds = this.data
      .filter((item) => item.checked)
      .map((item) => item.id);

    console.log('Selected IDs:', selectedIds);
  }

  getSubalbum(albumId: number) {
    this.route.navigateByUrl(`/admin/main/sub-albums/${albumId}`);
  }


}
