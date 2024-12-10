import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrl: './album.component.css'
})
export class AlbumComponent {

  data: any[] = [];
  checkAll = false;
  selectedIds: number[] = [];
  memberId: any;
  role: any;
  loading: boolean = false;

  constructor(private rout: ActivatedRoute, private route: Router, private service: SharedService, private location: Location, private toastr: ToastrService) { }

  // backClicked() {
  //   this.location.back();
  // }

  goBack() {
    this.route.navigateByUrl(`/admin/main/family-member/${this.itemId}/${this.itemEmail}`);
    localStorage.removeItem('itemId')
    localStorage.removeItem('itemEmail')
  }

  itemId: any;
  itemEmail: any;

  ngOnInit() {
    this.rout.paramMap.subscribe((params) => {
      this.memberId = params.get('memberId');
      //this.role = params.get('role');
      console.log(this.memberId, this.role);
    });

    this.getUsers();

    this.itemId = localStorage.getItem('itemId')
    this.itemEmail = localStorage.getItem('itemEmail')
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
  //       image: 'assets/img/timeline_img.png',
  //       title: 'Image 4',
  //       alt: 'Image 4 description'
  //     },
  //   ].map(item => ({ ...item, checked: false }));
  // }

  getUsers() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('user_id', this.memberId);
    this.service.postAPI('sub-admin/getalbumByuser_id', formURlData).subscribe({
      next: resp => {
        this.data = resp;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  selectedCount: number = 0;

  toggleAllCheckboxes() {
    this.data.forEach((item) => (item.checked = this.checkAll));
    this.updateSelectedIds();
  }

  updateSelectedIds() {
    this.selectedIds = this.data
      .filter((item) => item.checked)
      .map((item) => item.id);

    this.selectedCount = this.selectedIds.length; // Store the count
    console.log('Selected IDs length:', this.selectedCount);
  }


  deleteAlbumsId: any = '';

  getSelectedIds() {
    const selectedIds = this.data
      .filter((item) => item.checked)
      .map((item) => item.id)
      .join(',')

    this.deleteAlbumsId = selectedIds;
    console.log('Selected IDs:', selectedIds?.length);
  }

  getSubalbum(album: any) {
 
    if (album.containsSubAlbums) {
      this.route.navigateByUrl(`/admin/main/sub-albums/${album.id}/${this.memberId}`);
    } else {
      this.service.setData(album.albumItems);
      //this.route.navigateByUrl(`/admin/main/sub-album-photos`);
      this.route.navigate(['/admin/main/sub-album-photos'], { queryParams: { albumItems: JSON.stringify(album.albumItems) } });
    }
  }


  ieditImagePreview: string | null = null;
  selectedEditAlbumImage: any;
  editDetails: any;
  editAlbumName: any;

  getAlbumDetails(det: any) {
    console.log(det);
    this.editDetails = det;
    this.ieditImagePreview = this.editDetails.image;
  }


  albumName: any;
  imagePreview: string | null = null;
  selectedAlbumImage: any;

  onFileSelected(event: Event, type: any) {

    const fileInput = event.target as HTMLInputElement;
    if (type == 'add') {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        this.selectedAlbumImage = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }

    if (type == 'edit') {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        this.selectedEditAlbumImage = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.ieditImagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }

  }

  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;

  submitAlbum() {
    console.log('Album Name:', this.albumName);
    console.log('Selected File:', this.selectedAlbumImage);
    const formURlData = new FormData();
    if (this.selectedAlbumImage) {
      formURlData.append('image', this.selectedAlbumImage);
    }
    formURlData.set('Album Name:', this.albumName);

    this.service.postAPIFormData('dfs/fsfs', formURlData).subscribe({
      next: (resp) => {
        if (resp.success == true) {
          this.toastr.success(resp.message);
          this.closeModalAdd.nativeElement.click();
        } else {
          this.toastr.warning(resp.message);

        }
      },
      error: (error) => {

        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    });
  }


  @ViewChild('closeModalEdit') closeModalEdit!: ElementRef;

  submitEditAlbum() {
    const formURlData = new FormData();
    if (this.selectedEditAlbumImage) {
      formURlData.append('image', this.selectedEditAlbumImage);
    }
    formURlData.set('Album Name:', this.editAlbumName);

    this.service.postAPIFormData('dfs/fsfs', formURlData).subscribe({
      next: (resp) => {
        if (resp.success == true) {
          this.toastr.success(resp.message);
          this.closeModalEdit.nativeElement.click();

        } else {
          this.toastr.warning(resp.message);

        }
      },
      error: (error) => {

        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    });
  }





  @ViewChild('closeModalDel') closeModalDel!: ElementRef;

  btnDelLoader: boolean = false;

  deleteAlbums() {
    if (!this.deleteAlbumsId) {
      this.toastr.error('Plese select image/video to delete!');
      return
    }
    this.btnDelLoader = true;
    const formURlData = new URLSearchParams();
    formURlData.set('ids', this.deleteAlbumsId);
    //formURlData.set('date', this.date);
    this.service.postAPI(`sub-admin/delete-subadminid`, formURlData).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.closeModalDel.nativeElement.click();
          this.getUsers();
          this.btnDelLoader = false;
          this.toastr.success(resp.message);
        } else {
          this.btnDelLoader = false;
          this.toastr.warning(resp.message);
          this.getUsers();
        }
      }, error: error => {
        this.btnDelLoader = false;
        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    });
  }


}


// "id": 26432,
//         "subAlbums": [],
//         "created_at": "19 / 11 / 2024",
//         "parentAlbumId": null,
//         "appUserId": 2947,
//         "containsSubAlbums": false,
//         "parentAlbum": null,
//         "name": "Default Album",
//         "albumItems": [],
//         "totalalbumphoto": 0,
//         "cover_image": ""