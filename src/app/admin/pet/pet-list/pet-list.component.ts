import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../shared/services/shared.service';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pet-list',
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.css'
})
export class PetListComponent {

  ownerId: any;
  userId: any;
  data: any;
  searchQuery: any = '';
  loading: boolean = false;

  newPetForm!: FormGroup;
  editPetForm!: FormGroup;
  petImage!: File;
  petImage1: any;

  constructor(private aRoute: ActivatedRoute, private service: SharedService, private toastr: ToastrService, private route: Router, private location: Location) { }

  backClicked() {
    this.location.back();
  }

  goBack() {
    this.route.navigateByUrl(`/admin/main/family-member/${this.itemId}/${this.itemEmail}`);
    localStorage.removeItem('itemId')
    localStorage.removeItem('itemEmail')
  }

  maxDate: any;
  setMaxDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.maxDate = `${yyyy}-${mm}-${dd}`;
  }

  itemId: any;
  itemEmail: any;

  ngOnInit() {
    this.userId = localStorage.getItem('userIdForPet')
    this.aRoute.paramMap.subscribe((params) => {
      this.ownerId = params.get('ownerId');
    });

    this.getPet();
    this.initNewPetForm();
    this.initEditPetForm();
    this.setMaxDate();

    this.itemId = localStorage.getItem('itemId')
    this.itemEmail = localStorage.getItem('itemEmail')
  }

  initNewPetForm() {
    this.newPetForm = new FormGroup({
      image: new FormControl(null),
      name: new FormControl('', Validators.required),
      dName: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      isAlive: new FormControl('', Validators.required),
      //familyLink: new FormControl('', Validators.required),
      isDOBUnknown: new FormControl(''),
    })
  }

  initEditPetForm() {
    this.editPetForm = new FormGroup({
      image: new FormControl(null),
      name: new FormControl(this.petDetails?.name, Validators.required),
      dName: new FormControl(this.petDetails?.displayname, Validators.required),
      gender: new FormControl(this.petDetails?.gender, Validators.required),
      dob: new FormControl(this.convertDateFormat(this.petDetails?.dob), Validators.required),
      isAlive: new FormControl(this.petDetails?.is_alive, Validators.required),
      //familyLink: new FormControl('', Validators.required),
      isDOBUnknown: new FormControl(''),
    })
  }

  convertDateFormat(dateString: string): string {
    // debugger
    const parts = dateString?.split('/');
    if (parts?.length !== 3) {
      return '';
    }
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  // convertDateFormat(dateString: string): string {
  //   // debugger
  //   const parts = dateString?.split('/');
  //   if (parts?.length !== 3) {
  //     return '';
  //   }
  //   const day = parts[0];
  //   const month = parts[1];
  //   const year = parts[2];
  //   return `${year}-${month}-${day}`;
  // }
  // created_at
  // : 
  // "03/12/2024"
  // displayname
  // : 
  // "jud"
  // dob
  // : 
  // "2023-10-11"
  // family_id
  // : 
  // 744
  // gender
  // : 
  // "female"
  // id
  // : 
  // 396
  // images
  // : 
  // ""
  // images_url
  // : 
  // ""
  // is_alive
  // : 
  // 1
  // name
  // : 
  // "Juddy"
  // owner_date_of_birth
  // : 
  // "11/10/2000"
  // owner_displayname
  // : 
  // "shaun"
  // owner_id
  // : 
  // 3103
  // owner_name
  // : 
  // "shaun"
  // popup_move
  // : 
  // 0
  // popup_status
  // : 
  // 0
  // unknown_dob
  // : 
  // 0
  // user_id
  // : 
  // 324

  getPet() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('owner_id', this.ownerId);
    formURlData.set('user_id', '123');
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
    //console.log('ggjgjgjhgjhg', this.petDetails);

    this.initEditPetForm();
    debugger
    // Set initial filteredRelationsEdit based on the current gender
    const isDOBUnknown = this.editPetForm.get('isDOBUnknown');
    const dobControl = this.petDetails?.dob ? this.petDetails?.dob : this.editPetForm.get('dob')?.value;


    // Check for specific DOB values
    const dobValue = dobControl;
    if (!dobValue) {
      isDOBUnknown?.setValue(true);
      this.editPetForm.get('dob')?.disable();
    } else {
      isDOBUnknown?.setValue(false);
    }
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



  onImageSelected(event: Event, type: any): void {
    const inputElement = event.target as HTMLInputElement;
    const file = (event.target as HTMLInputElement).files?.[0];

    if (inputElement.files && inputElement.files.length > 0) {
      this.petImage = inputElement.files[0];
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.petImage1 = reader.result;
        this.newPetForm.patchValue({ image: file });
        this.newPetForm.get('image')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  onPetDOBChange(): void {
    const isDOBUnknown = this.newPetForm.get('isDOBUnknown')?.value;

    if (isDOBUnknown) {
      // Disable the dob field and clear validators when DOB is unknown
      this.newPetForm.get('dob')?.disable();
      this.newPetForm.get('dob')?.clearValidators();
    } else {
      // Enable the dob field and add back the required validator
      this.newPetForm.get('dob')?.enable();
      this.newPetForm.get('dob')?.setValidators(Validators.required);
    }

    // Update validity to apply the changes
    this.newPetForm.get('dob')?.updateValueAndValidity();
  }

  addPetLoader: boolean = false;
  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;

  addNewPet(): void {
    this.newPetForm.markAllAsTouched();
    if (this.newPetForm.valid) {
      console.log('Form Values:', this.newPetForm.value);
      this.addPetLoader = true;
      const formURlData = new FormData();
      if (this.petImage) {
        formURlData.append('file', this.petImage);
      }
      formURlData.set('name', this.newPetForm.value.name);
      formURlData.set('displayname', this.newPetForm.value.dName);
      formURlData.set('gender', this.newPetForm.value.gender);
      // if (this.newPetForm.value.dob) {
      //   formURlData.set('dob', this.newPetForm.value.dob);
      // }
      const dob = this.newPetForm.value.dob;

      const isDOBUnknown = this.newPetForm.get('isDOBUnknown')?.value;
      if (!isDOBUnknown) {
        if (dob) {
          const formattedDOB = this.formatDateToDDMMYYYY(dob);
          formURlData.set('dob', formattedDOB);
        }
      }

      if (this.newPetForm.value.dob) {
        formURlData.set('unknown_dob', '0');
      } else {
        formURlData.set('unknown_dob', '1');
      }


      formURlData.set('is_alive', this.newPetForm.value.isAlive);
      formURlData.set('owner_id', this.ownerId);
      formURlData.set('user_id', this.userId);
      //formURlData.set('familyLink', this.newPetForm.value.familyLink);

      this.service.postAPIFormData('sub-admin/addPet', formURlData).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.addPetLoader = false;
            this.closeModalAdd.nativeElement.click();
            this.petImage1 = null;
            this.newPetForm.reset();
            this.getPet();
          } else {
            this.toastr.warning(resp.message);
            this.addPetLoader = false;
            this.getPet();
          }
        },
        error: (error) => {
          this.addPetLoader = false;
          if (error.error.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Something went wrong!');
          }
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }


  editPetProfile!: File;

  handleFileInputEditPet(event: any) {
    const file = event.target.files[0];
    const img = document.getElementById('blahPet') as HTMLImageElement;

    if (img && file) {
      img.style.display = 'block';
      const reader = new FileReader();
      reader.onload = (e: any) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files?.length > 0) {
      this.editPetProfile = inputElement.files[0];
    }
  }

  onEditPetDOBChange(): void {
    const isDOBUnknown = this.editPetForm.get('isDOBUnknown')?.value;

    if (isDOBUnknown) {
      // Disable the dob field and clear validators when DOB is unknown
      this.editPetForm.get('dob')?.disable();
      this.editPetForm.get('dob')?.clearValidators();
    } else {
      // Enable the dob field and add back the required validator
      this.editPetForm.get('dob')?.enable();
      this.editPetForm.get('dob')?.setValidators(Validators.required);
    }

    // Update validity to apply the changes
    this.editPetForm.get('dob')?.updateValueAndValidity();
  }

  @ViewChild('closeModalEditPet') closeModalEditPet!: ElementRef;
  // addPetLoader: boolean = false;
  parentImage1: any;

  editPet(): void {
    this.editPetForm.markAllAsTouched();
    if (this.editPetForm.valid) {
      console.log('Form Values:', this.editPetForm.value);
      this.addPetLoader = true;
      const formURlData = new FormData();
      if (this.editParentProfile) {
        formURlData.append('file', this.editParentProfile);
      }
      formURlData.set('id', this.petId);
      formURlData.set('owner_id', this.ownerId);
      formURlData.set('user_id', this.userId);
      formURlData.set('name', this.editPetForm.value.name);
      formURlData.set('displayname', this.editPetForm.value.dName);
      formURlData.set('gender', this.editPetForm.value.gender);
      // if (this.editPetForm.value.dob) {
      //   formURlData.set('dob', this.editPetForm.value.dob);
      // }

      const dob = this.editPetForm.value.dob;

      const isDOBUnknown = this.editPetForm.get('isDOBUnknown')?.value;
      if (!isDOBUnknown) {
        if (dob) {
          const formattedDOB = this.formatDateToDDMMYYYY(dob);
          formURlData.set('dob', formattedDOB);
        }
      }
      if (this.editPetForm.value.dob) {
        formURlData.set('unknown_dob', '0');
      } else {
        formURlData.set('unknown_dob', '1');
      }
      formURlData.set('is_alive', this.editPetForm.value.isAlive);
      // formURlData.set('rName', this.editPetForm.value.relationName);
      // formURlData.set('rWith', this.editPetForm.value.relationWith);


      this.service.postAPIFormData('sub-admin/updatePet', formURlData).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.addPetLoader = false;
            this.closeModalEditPet.nativeElement.click();
            this.parentImage1 = null;
            this.getPet();
          } else {
            this.toastr.warning(resp.message);
            this.addPetLoader = false;
            this.getPet();
          }
        },
        error: (error) => {
          this.addPetLoader = false;
          if (error.error.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Something went wrong!');
          }
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  editParentProfile!: File;

  handleFileInputEditParent(event: any) {
    const file = event.target.files[0];
    const img = document.getElementById('blah2') as HTMLImageElement;

    if (img && file) {
      img.style.display = 'block';
      const reader = new FileReader();
      reader.onload = (e: any) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files?.length > 0) {
      this.editParentProfile = inputElement.files[0];
    }
  }


}
