import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-pet-sub-album',
  templateUrl: './pet-sub-album.component.html',
  styleUrl: './pet-sub-album.component.css'
})
export class PetSubAlbumComponent {

  data: any[] = [];
  checkAll = false;
  selectedIds: number[] = [];
  albumId!: any;
  petId: any;
  loading: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private service: SharedService, private location: Location, private toastr: ToastrService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.albumId = params.get('albumId');
      this.petId = params.get('petId');
    });

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
    formURlData.set('pet_id', this.petId);
    //formURlData.set('user_id', '123');
    this.service.postAPI('sub-admin/getpetSubalbum', formURlData).subscribe({
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
      this.router.navigateByUrl(`/admin/main/pet-album/${album.id}`);
    } else {
      // this.service.setData(album.albumItems);
      // console.log('Data set in service:', album.albumItems);
      // this.router.navigateByUrl(`/admin/main/pet-sub-album-photos`);
      this.router.navigate(['/admin/main/pet-sub-album-photos'], { queryParams: { albumItems: JSON.stringify(album.albumItems) } });
      //this.toastr.warning('No sub-album found!')
    }
  }

  backClicked() {
    this.location.back();
  }


}
