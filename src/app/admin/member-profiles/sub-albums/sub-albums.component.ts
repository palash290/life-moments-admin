import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sub-albums',
  templateUrl: './sub-albums.component.html',
  styleUrl: './sub-albums.component.css'
})
export class SubAlbumsComponent {

  data: any[] = [];
  checkAll = false;
  selectedIds: number[] = [];
  albumId!: any;
  userId: any;
  loading: boolean = false;

  previousAlbumId!: any;
  previousUserId: any;

  constructor(private router: Router, private route: ActivatedRoute, private service: SharedService, private location: Location, private toastr: ToastrService) { }

  backClicked() {
    //this.router.navigateByUrl(`/admin/main/sub-albums/${this.previousAlbumId}/${this.previousUserId}`);
    this.location.back();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.albumId = params.get('albumId');
      this.userId = params.get('userId');
    });
    this.previousAlbumId = this.albumId
    this.previousUserId = this.userId
    this.getUsers();
  }

  // loadData() {
  //   this.data = [
  //     {
  //       id: 1,
  //       image: '',
  //       title: 'Image 1',
  //       alt: 'Image 1 description'
  //     },
  //     {
  //       id: 2,
  //       image: 'assets/img/men_user.png',
  //       title: 'Image 2',
  //       alt: 'Image 2 description'
  //     },
  //     {
  //       id: 3,
  //       image: '',
  //       title: 'Image 3',
  //       alt: 'Image 3 description'
  //     },
  //     {
  //       id: 4,
  //       image: 'assets/img/old_men.png',
  //       title: 'Image 4',
  //       alt: 'Image 4 description'
  //     },
  //   ].map(item => ({ ...item, checked: false }));
  // }

  getUsers() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('id', this.albumId);
    formURlData.set('user_id', this.userId);
    this.service.postAPI('sub-admin/getSubalbum', formURlData).subscribe({
      next: resp => {
        this.loading = false;
        this.data = resp.subAlbums;
        console.log('this.data', this.data);
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

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

  getPhotos(album: any) {
    if (album.containsSubAlbums) {
      this.router.navigate([`/admin/main/sub-albums/${album.id}/${this.userId}`]);

      this.route.paramMap.subscribe((params) => {
        this.albumId = params.get('albumId');
        this.userId = params.get('userId');  
        this.getUsers();
      });
      // localStorage.setItem('albumId', this.albumId);
      // localStorage.setItem('userId', this.userId);

    } else {
      // this.service.setData(album.albumItems);
      // console.log('Data set in service:', album.albumItems);
      // this.router.navigateByUrl(`/admin/main/sub-album-photos`);
      this.router.navigate(['/admin/main/sub-album-photos'], { queryParams: { albumItems: JSON.stringify(album.albumItems) } });

    }
  }


}
