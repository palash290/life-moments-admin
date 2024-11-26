import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../shared/services/shared.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pet-list',
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.css'
})
export class PetListComponent {

  ownerId: any;
  data: any;
  searchQuery: any = '';
  loading: boolean = false;

  constructor(private aRoute: ActivatedRoute, private service: SharedService, private toastr: ToastrService, private route: Router, private location: Location) { }

  backClicked() {
    this.location.back();
  }

  goBack(){
    this.route.navigateByUrl(`/admin/main/family-member/${this.itemId}/${this.itemEmail}`);
    localStorage.removeItem('itemId')
    localStorage.removeItem('itemEmail')
  }

  itemId: any;
  itemEmail: any;

  ngOnInit() {
    this.aRoute.paramMap.subscribe((params) => {
      this.ownerId = params.get('ownerId');
    });

    this.getPet();

    this.itemId = localStorage.getItem('itemId')
    this.itemEmail = localStorage.getItem('itemEmail')
  }

  getPet() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('owner_id', this.ownerId);
    this.service.postAPI(`sub-admin/getPets`, formURlData).subscribe({
      next: (resp) => {
        this.loading = false;
        this.data = resp.pets; // Add `checked: false` to each user
      },
      error: (error) => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  petDetails: any;
  petId: any;

  getPetDetails(det: any) {
    this.petId = det.id
    this.petDetails = det;
  }

  @ViewChild('closeModalViewPet') closeModalViewPet!: ElementRef;
  
  getPetTimeline() {
    //this.closeModalViewMember.nativeElement.click();
    this.closeModalViewPet.nativeElement.click();
    //this.closeModalViewParent.nativeElement.click();
    this.route.navigateByUrl(`/admin/main/pet-timeline/${this.petId}/${this.ownerId}`);
  }

  getPetAlbum() {
    // this.closeModalViewMember.nativeElement.click();
    this.closeModalViewPet.nativeElement.click();
    // this.closeModalViewParent.nativeElement.click();
    this.route.navigateByUrl(`/admin/main/pet-albums/${this.petId}`);
  }


}
// "id": 373,
// "name": "Pet New",
// "displayname": "Pet",
// "gender": "male",
// "dob": "20/11/2024",
// "unknown_dob": 0,
// "owner_id": 2948,
// "created_at": "19/11/2024",
// "user_id": 299,
// "images": "1732051793478.png",
// "popup_status": 1,
// "popup_move": 0,
// "is_alive": 0,
// "owner_name": "Karan",
// "owner_date_of_birth": "Above 18",
// "owner_displayname": "Karan",
// "family_id": 719,
// "images_url": "http://18.229.202.71:4000/pets_album/1732051793478.png"