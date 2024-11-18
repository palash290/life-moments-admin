import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-family-members',
  templateUrl: './family-members.component.html',
  styleUrl: './family-members.component.css'
})
export class FamilyMembersComponent {

  newMemberForm!: FormGroup;
  newPetForm!: FormGroup;
  editPetForm!: FormGroup;
  editMemberForm!: FormGroup;
  editParentForm!: FormGroup;
  singleMemberData: any;
  data: any[] = [];
  parentImage!: File;
  parentImage1: any;
  petImage!: File;
  petImage1: any;
  memberId: any;
  parentId: any;
  addMemLoader: boolean = false;
  addPetLoader: boolean = false;

  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;

  constructor(private aRoute: ActivatedRoute, private service: SharedService, private toastr: ToastrService, private route: Router) { }
  ////////////////parent is only edtiting////////////////////
  ngOnInit() {
    this.aRoute.paramMap.subscribe((params) => {
      this.parentId = params.get('parentId');
    });

    this.initNewMemberForm();
    this.initNewPetForm();
    this.initEditMemberForm();
    this.initEditParentForm();
    this.initEditPetForm();
    this.loadData();
  }

  loadData() {
    // Mock API call to fetch data
    this.data = [
      { id: 1, image: 'assets/img/np_pro.png', name: 'Vivian Aufderhar', displayName: 'Vivian', relation: 'Bro', gender: 'M', dob: '23-3-1999', isBlocked: true },
      { id: 2, image: 'assets/img/user_img.png', name: 'Vivian Aufderhar', displayName: 'Vivian', relation: 'Sis', gender: 'F', dob: '23-3-1999', isBlocked: false },
      { id: 2, image: 'assets/img/user_img.png', name: 'Vivian Aufderhar', displayName: 'Vivian', relation: 'Pet', gender: 'F', dob: '23-3-1999', isBlocked: false },
    ]
  }

  // getUsers() {
  //   this.service.getApi('getdashboard').subscribe({
  //     next: (resp) => {
  //       this.data = resp.users.map(user => ({ ...user, checked: false })); // Add `checked: false` to each user
  //     },
  //     error: (error) => {
  //       console.log(error.message);
  //     }
  //   });
  // }

  initNewMemberForm() {
    this.newMemberForm = new FormGroup({
      image: new FormControl(null),
      name: new FormControl('', Validators.required),
      dName: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      isAlive: new FormControl('', Validators.required),
      relationName: new FormControl('', Validators.required),
      relationWith: new FormControl('', Validators.required),
      isAdult: new FormControl({ value: false, disabled: true }),
      isDOBUnknown: new FormControl(''),
    })
  }

  initNewPetForm() {
    this.newPetForm = new FormGroup({
      image: new FormControl(null),
      name: new FormControl('', Validators.required),
      dName: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      isAlive: new FormControl('', Validators.required),
      familyLink: new FormControl('', Validators.required),
      isDOBUnknown: new FormControl(''),
    })
  }

  initEditPetForm() {
    this.editPetForm = new FormGroup({
      image: new FormControl(null),
      name: new FormControl('cxzc', Validators.required),
      dName: new FormControl('czx', Validators.required),
      gender: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      isAlive: new FormControl('', Validators.required),
      familyLink: new FormControl('', Validators.required),
      isDOBUnknown: new FormControl(''),
    })
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

  initEditMemberForm() {
    this.editMemberForm = new FormGroup({
      image: new FormControl(null),
      name: new FormControl('this.singleMemberData.name', Validators.required),
      dName: new FormControl('this.singleMemberData.dName', Validators.required),
      gender: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      isAlive: new FormControl('', Validators.required),
      relationName: new FormControl('', Validators.required),
      relationWith: new FormControl('', Validators.required),
    })
  }

  editMemberProfile!: File;

  handleFileInputEditMember(event: any) {
    const file = event.target.files[0];
    const img = document.getElementById('blagEditMem') as HTMLImageElement;

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
      this.editMemberProfile = inputElement.files[0];
    }
  }

  initEditParentForm() {
    this.editParentForm = new FormGroup({
      image: new FormControl(null),
      name: new FormControl('this.singleMemberData.name', Validators.required),
      dName: new FormControl('this.singleMemberData.dName', Validators.required),
      gender: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      isAlive: new FormControl('', Validators.required),
      relationName: new FormControl('', Validators.required),
      relationWith: new FormControl('', Validators.required),
    })
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

  onImageSelected(event: Event, type: any): void {
    const inputElement = event.target as HTMLInputElement;
    const file = (event.target as HTMLInputElement).files?.[0];

    if (type == 'parent') {
      if (inputElement.files && inputElement.files.length > 0) {
        this.parentImage = inputElement.files[0];
      }

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.parentImage1 = reader.result;
          this.newMemberForm.patchValue({ image: file });
          this.newMemberForm.get('image')?.updateValueAndValidity();
        };
        reader.readAsDataURL(file);
      }
    }

    if (type == 'pet') {
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

  }

  onDOBUnknownChange(): void {
    const isDOBUnknown = this.newMemberForm.get('isDOBUnknown')?.value;

    if (isDOBUnknown) {
      this.newMemberForm.get('isAdult')?.enable();
      //this.newMemberForm.get('dob')?.disable();     
    } else {
      this.newMemberForm.get('isAdult')?.disable();
      //this.newMemberForm.get('dob')?.enable();     
      this.newMemberForm.get('isAdult')?.setValue(false);
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

  addNewMember(): void {
    this.newMemberForm.markAllAsTouched();
    if (this.newMemberForm.valid) {
      console.log('Form Values:', this.newMemberForm.value);
      this.addMemLoader = true;
      const formURlData = new FormData();
      if (this.parentImage) {
        formURlData.append('image', this.parentImage);
      }
      formURlData.set('name', this.newMemberForm.value.name);
      formURlData.set('dName', this.newMemberForm.value.dName);
      formURlData.set('gender', this.newMemberForm.value.gender);
      formURlData.set('dob', this.newMemberForm.value.dob);
      formURlData.set('isalive', this.newMemberForm.value.isAlive);
      formURlData.set('rName', this.newMemberForm.value.relationName);
      formURlData.set('rWith', this.newMemberForm.value.relationWith);
      if (this.newMemberForm.value.isAdult) {
        formURlData.set('18+', this.newMemberForm.value.isAdult);
      }

      this.service.postAPIFormData('dfs/fsfs', formURlData).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.addMemLoader = false;
            this.closeModalAdd.nativeElement.click();
            this.parentImage1 = null;
          } else {
            this.toastr.warning(resp.message);
            this.addMemLoader = false;
          }
        },
        error: (error) => {
          this.addMemLoader = false;
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

  @ViewChild('closeModalEditMember') closeModalEditMember!: ElementRef;

  editmember(): void {
    this.editMemberForm.markAllAsTouched();
    if (this.editMemberForm.valid) {
      console.log('Form Values:', this.editMemberForm.value);
      this.addMemLoader = true;
      const formURlData = new FormData();
      if (this.editMemberProfile) {
        formURlData.append('image', this.editMemberProfile);
      }
      formURlData.set('name', this.editMemberForm.value.name);
      formURlData.set('dName', this.editMemberForm.value.dName);
      formURlData.set('gender', this.editMemberForm.value.gender);
      formURlData.set('dob', this.editMemberForm.value.dob);
      formURlData.set('isalive', this.editMemberForm.value.isAlive);
      formURlData.set('rName', this.editMemberForm.value.relationName);
      formURlData.set('rWith', this.editMemberForm.value.relationWith);
      if (this.editMemberForm.value.isAdult) {
        formURlData.set('18+', this.editMemberForm.value.isAdult);
      }

      this.service.postAPIFormData('dfs/fsfs', formURlData).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.addMemLoader = false;
            this.closeModalEditParent.nativeElement.click();
            this.parentImage1 = null;
          } else {
            this.toastr.warning(resp.message);
            this.addMemLoader = false;
          }
        },
        error: (error) => {
          this.addMemLoader = false;
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


  @ViewChild('closeModalEditParent') closeModalEditParent!: ElementRef;

  editParent(): void {
    this.editParentForm.markAllAsTouched();
    if (this.editParentForm.valid) {
      console.log('Form Values:', this.editParentForm.value);
      this.addMemLoader = true;
      const formURlData = new FormData();
      if (this.editParentProfile) {
        formURlData.append('image', this.editParentProfile);
      }
      formURlData.set('name', this.editParentForm.value.name);
      formURlData.set('dName', this.editParentForm.value.dName);
      formURlData.set('gender', this.editParentForm.value.gender);
      formURlData.set('dob', this.editParentForm.value.dob);
      formURlData.set('isalive', this.editParentForm.value.isAlive);
      formURlData.set('rName', this.editParentForm.value.relationName);
      formURlData.set('rWith', this.editParentForm.value.relationWith);
      if (this.editParentForm.value.isAdult) {
        formURlData.set('18+', this.editParentForm.value.isAdult);
      }

      this.service.postAPIFormData('dfs/fsfs', formURlData).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.addMemLoader = false;
            this.closeModalEditParent.nativeElement.click();
            this.parentImage1 = null;
          } else {
            this.toastr.warning(resp.message);
            this.addMemLoader = false;
          }
        },
        error: (error) => {
          this.addMemLoader = false;
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


  addNewPet(): void {
    this.newPetForm.markAllAsTouched();
    if (this.newPetForm.valid) {
      console.log('Form Values:', this.newPetForm.value);
      this.addPetLoader = true;
      const formURlData = new FormData();
      if (this.petImage) {
        formURlData.append('image', this.petImage);
      }
      formURlData.set('name', this.newPetForm.value.name);
      formURlData.set('dName', this.newPetForm.value.dName);
      formURlData.set('gender', this.newPetForm.value.gender);
      if (this.newPetForm.value.dob) {
        formURlData.set('dob', this.newPetForm.value.dob);
      }
      formURlData.set('isalive', this.newPetForm.value.isAlive);
      formURlData.set('familyLink', this.newPetForm.value.familyLink);

      this.service.postAPIFormData('dfs/fsfs', formURlData).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.addPetLoader = false;
            this.closeModalAdd.nativeElement.click();
            this.petImage1 = null;
          } else {
            this.toastr.warning(resp.message);
            this.addPetLoader = false;
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

  @ViewChild('closeModalEditPet') closeModalEditPet!: ElementRef;

  editPet(): void {
    this.editPetForm.markAllAsTouched();
    if (this.editPetForm.valid) {
      console.log('Form Values:', this.editPetForm.value);
      this.addMemLoader = true;
      const formURlData = new FormData();
      if (this.editParentProfile) {
        formURlData.append('image', this.editParentProfile);
      }
      formURlData.set('name', this.editPetForm.value.name);
      formURlData.set('dName', this.editPetForm.value.dName);
      formURlData.set('gender', this.editPetForm.value.gender);
      if (this.editPetForm.value.dob) {
        formURlData.set('dob', this.editPetForm.value.dob);
      }
      formURlData.set('isalive', this.editPetForm.value.isAlive);
      formURlData.set('rName', this.editPetForm.value.relationName);
      formURlData.set('rWith', this.editPetForm.value.relationWith);
      // if (this.editPetForm.value.isAdult) {
      //   formURlData.set('18+', this.editPetForm.value.isAdult);
      // }

      this.service.postAPIFormData('dfs/fsfs', formURlData).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.addMemLoader = false;
            this.closeModalEditPet.nativeElement.click();
            this.parentImage1 = null;
          } else {
            this.toastr.warning(resp.message);
            this.addMemLoader = false;
          }
        },
        error: (error) => {
          this.addMemLoader = false;
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

  getSingleMemberData(id: any) {
    //to save selected id
    this.memberId = id;
    this.service.getApi(`https://www.c4c.gr:4000/admin/events/${id}`).subscribe({
      next: resp => {
        this.singleMemberData = resp.events;
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  @ViewChild('closeModalViewMember') closeModalViewMember!: ElementRef;
  @ViewChild('closeModalViewPet') closeModalViewPet!: ElementRef;
  @ViewChild('closeModalViewParent') closeModalViewParent!: ElementRef;

  getMemberAlbum() {
    this.closeModalViewMember.nativeElement.click();
    this.closeModalViewPet.nativeElement.click();
    this.closeModalViewParent.nativeElement.click();
    this.route.navigateByUrl(`/admin/main/albums/${this.memberId}`);
  }


  relationNames: any;
  relationId: any;
  getRelationNames() {
    this.service.getApi('sub-admin/get-language').subscribe(response => {
      if (response.success) {
        this.relationNames = response.data;
        if (this.relationNames.length > 0) {
          this.relationId = this.relationNames[0].code;
        }
      }
    });
  }

  onRelationChange(event: any): void {
    const selectedId = event.target.value;
    const selectedCategory = this.relationNames.find((language: { code: any; }) => language.code == selectedId);

    //const selectedCategory = this.categories.find(category => category.id === event.value);

    if (selectedCategory) {
      this.relationId = selectedCategory.code;
      //this.selectedCategoryName = selectedCategory.name;
      console.log('Selected Category ID:', this.relationId);
      //this.getPrivacy(this.relationId)
      // console.log('Selected Category Name:', this.selectedCategoryName);
    }
  }


}
