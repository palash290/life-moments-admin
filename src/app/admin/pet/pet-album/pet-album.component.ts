import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pet-album',
  templateUrl: './pet-album.component.html',
  styleUrl: './pet-album.component.css'
})
export class PetAlbumComponent {

  petId: any;
  data: any[] = [];
  selectedIds: number[] = [];
  checkAll = false;
  loading: boolean = false;

  constructor(private rout: ActivatedRoute, private route: Router, private service: SharedService, private location: Location, private toastr: ToastrService) { }

  backClicked() {
    this.location.back();
  }
  
  ngOnInit() {
    this.rout.paramMap.subscribe((params) => {
      this.petId = params.get('petId');
      //this.role = params.get('role');
      console.log(this.petId);
    });

    this.getPetAlbum();
  }

  getPetAlbum() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('pet_id', this.petId);
    formURlData.set('user_id', '123');
    this.service.postAPI('getpetalbumByuser_id', formURlData).subscribe({
      next: resp => {
        this.loading = false;
        this.data = resp;
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

  getSubalbum(album: any) {
    if(album.containsSubAlbums){
      this.route.navigateByUrl(`/admin/main/pet-sub-albums/${album.id}/${this.petId}`);
    } else{
      this.service.setData(album.albumItems);
      this.route.navigateByUrl(`/admin/main/pet-sub-album-photos/${album.albumItems}`);
      //this.toastr.warning('No sub-album found!')
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


}
