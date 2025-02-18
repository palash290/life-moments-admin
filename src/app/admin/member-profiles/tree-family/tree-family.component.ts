import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tree-family',
  templateUrl: './tree-family.component.html',
  styleUrl: './tree-family.component.css'
})
export class TreeFamilyComponent {

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
  email: any;
  addMemLoader: boolean = false;
  editMemLoader: boolean = false;
  addPetLoader: boolean = false;
  searchQuery = '';
  loading: boolean = false;

  //Pagination//
  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreData: boolean = true;
  totalPages: number = 0;

  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;

  constructor(private aRoute: ActivatedRoute, private service: SharedService, private toastr: ToastrService, private route: Router) { }

  backClicked() {
    this.route.navigateByUrl(`/admin/main/member-profile`);
    localStorage.removeItem('itemId');
    localStorage.removeItem('itemEmail');
  }

  maxDate: any;
  setMaxDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.maxDate = `${yyyy}-${mm}-${dd}`;
  }

  ////////////////parent is only edtiting////////////////////
  ngOnInit() {
    this.aRoute.paramMap.subscribe((params) => {
      this.parentId = params.get('parentId');
      this.email = params.get('email');
    });
    localStorage.setItem('itemId', this.parentId)
    localStorage.setItem('itemEmail', this.email)

    this.getMembers();
    this.initNewMemberForm();
    this.initNewPetForm();
    this.initEditMemberForm();
    this.initEditParentForm();
    this.initEditPetForm();

    this.setMaxDate();

    this.newMemberForm.get('gender')?.valueChanges.subscribe((gender) => {

      if (gender === 'male') {
        this.filteredRelations = [...this.maleRelations];
      } else if (gender === 'female') {
        this.filteredRelations = [...this.femaleRelations];
      } else {
        this.filteredRelations = [...this.allRelations];
      }

      // Reset relationName field when gender changes
      this.newMemberForm.get('relationName')?.setValue('');
    });

    this.editMemberForm.get('gender')?.valueChanges.subscribe((gender) => {

      if (gender === 'male') {
        this.filteredRelationsEdit = [...this.maleRelationsEdit];
      } else if (gender === 'female') {
        this.filteredRelationsEdit = [...this.femaleRelationsEdit];
      } else {
        this.filteredRelationsEdit = [...this.allRelationsEdit];
      }

      // Reset relationName field when gender changes
      this.editMemberForm.get('relationName')?.setValue('');
    });

  }

  allMemberList: any;
  filteredOutMembers: any[] = [];
  parentDetail: any;

  getMembers() {
 
    // this.service.getApi(`sub-admin/get-all-familys/?userId=${this.parentId}`).subscribe({
    this.service.getApi(`sub-admin/get-all-familys/?userId=${this.parentId}&page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}`).subscribe({
      next: (resp) => {
        this.allMemberList = resp.data;
        this.parentDetail = resp.userDetail;
        this.hasMoreData = resp.data.length == this.pageSize;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }


  initNewMemberForm() {
    this.newMemberForm = new FormGroup({
      image: new FormControl(null),
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\s*\S+(?:\s+\S+)+\s*$/)
      ]),
      dName: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      isAlive: new FormControl('', Validators.required),
      relationName: new FormControl('', Validators.required),
      relationWith: new FormControl('', Validators.required),
      isAdult: new FormControl(true),
      isDOBUnknown: new FormControl(''),
    })
    this.filteredRelations = [...this.allRelations];

    this.newMemberForm.get('name')?.valueChanges.subscribe((value: string) => {
      if (value) {
        const firstWord = value.split(' ')[0];
        this.newMemberForm.get('dName')?.setValue(firstWord, { emitEvent: false });
      }
    });

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

      name: new FormControl(this.singleMemberDetail?.full_name, [
        Validators.required,
        Validators.pattern(/^\s*\S+(?:\s+\S+)+\s*$/)
      ]),
      dName: new FormControl(this.singleMemberDetail?.user_name, Validators.required),

      gender: new FormControl({ value: this.singleMemberDetail?.other_gender == 'none' ? this.singleMemberDetail?.gender : this.singleMemberDetail?.other_gender, disabled: true }, Validators.required),
      dob: new FormControl(this.convertDateFormat(this.singleMemberDetail?.date_of_birth), Validators.required),
      isAlive: new FormControl(this.singleMemberDetail?.is_alive, Validators.required),
      relationName: new FormControl(this.singleMemberDetail?.relation_id, Validators.required),
      relationWith: new FormControl(this.singleMemberDetail?.relationWith.id, Validators.required),
      isAdult: new FormControl(true),
      isDOBUnknown: new FormControl(''),
    })

    const initialGender = this.singleMemberDetail?.gender;
    if (initialGender === 'male') {
      this.filteredRelationsEdit = [...this.maleRelationsEdit];
    } else if (initialGender === 'female') {
      this.filteredRelationsEdit = [...this.femaleRelationsEdit];
    } else {
      this.filteredRelationsEdit = [...this.allRelationsEdit];
    }

    this.editMemberForm.get('gender')?.valueChanges.subscribe((gender) => {
      console.log('Edit Member Form - Gender Changed:', gender); // Debug log
      if (gender === 'male') {
        this.filteredRelationsEdit = [...this.maleRelationsEdit];
      } else if (gender === 'female') {
        this.filteredRelationsEdit = [...this.femaleRelationsEdit];
      } else {
        this.filteredRelationsEdit = [...this.allRelationsEdit];
      }

      this.editMemberForm.get('relationName')?.setValue('');
    });

    this.editMemberForm.get('name')?.valueChanges.subscribe((value: string) => {
      if (value) {
        const firstWord = value.split(' ')[0];
        this.editMemberForm.get('dName')?.setValue(firstWord, { emitEvent: false });
      }
    });

  }

  convertDateFormat(dateString: string): string {
    const parts = dateString?.split('/');
    if (parts?.length !== 3) {
      return '';
    }
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return `${year}-${month}-${day}`;
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
      name: new FormControl(this.parentDetail?.fullName, [
        Validators.required,
        Validators.pattern(/^\s*\S+(?:\s+\S+)+\s*$/)
      ]),
      dName: new FormControl(this.filteredOutMembers[0]?.user_name, Validators.required),
      gender: new FormControl({ value: this.filteredOutMembers[0]?.other_gender == 'none' ? this.filteredOutMembers[0]?.gender : this.filteredOutMembers[0]?.other_gender, disabled: true }, Validators.required),
      dob: new FormControl(this.convertDateFormat(this.filteredOutMembers[0]?.date_of_birth), Validators.required),
    })

    this.editParentForm.get('name')?.valueChanges.subscribe((value: string) => {
      if (value) {
        const firstWord = value.split(' ')[0]; // Get the first word
        this.editParentForm.get('dName')?.setValue(firstWord, { emitEvent: false });
      }
    });

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
      this.newMemberForm.get('dob')?.disable();
    } else {
      this.newMemberForm.get('isAdult')?.disable();
      this.newMemberForm.get('dob')?.enable();
      this.newMemberForm.get('isAdult')?.setValue(false);
    }
  }

  onDOBUnknownEditChange(): void {
    const isDOBUnknown = this.editMemberForm.get('isDOBUnknown')?.value;

    if (isDOBUnknown) {
      this.editMemberForm.get('isAdult')?.enable();
      this.editMemberForm.get('dob')?.disable();
    } else {
      this.editMemberForm.get('isAdult')?.disable();
      this.editMemberForm.get('dob')?.enable();
      this.editMemberForm.get('isAdult')?.setValue(false);
    }
  }

  onPetDOBChange(): void {
    const isDOBUnknown = this.newPetForm.get('isDOBUnknown')?.value;

    if (isDOBUnknown) {
      this.newPetForm.get('dob')?.disable();
      this.newPetForm.get('dob')?.clearValidators();
    } else {
      this.newPetForm.get('dob')?.enable();
      this.newPetForm.get('dob')?.setValidators(Validators.required);
    }

    this.newPetForm.get('dob')?.updateValueAndValidity();
  }

  onEditPetDOBChange(): void {
    const isDOBUnknown = this.editPetForm.get('isDOBUnknown')?.value;

    if (isDOBUnknown) {
      this.editPetForm.get('dob')?.disable();
      this.editPetForm.get('dob')?.clearValidators();
    } else {
      this.editPetForm.get('dob')?.enable();
      this.editPetForm.get('dob')?.setValidators(Validators.required);
    }

    this.editPetForm.get('dob')?.updateValueAndValidity();
  }

  filteredRelations: Array<{ id: any, value: string; label: string }> = [];

  filteredRelationsEdit: Array<{ id: any, value: string; label: string }> = [];

  maleRelations = [
    { id: '12', value: 'father', label: 'Father' },
    { id: '13', value: 'step_father', label: 'Step Father' },
    { id: '14', value: 'caregiver', label: 'Caregiver' },
    { id: '15', value: 'son', label: 'Son' },
    { id: '16', value: 'step_son', label: 'Step Son' },

    { id: '17', value: 'dependent', label: 'Dependent' },

    { id: '18', value: 'brother', label: 'Brother' },
    { id: '19', value: 'step_brother', label: 'Step Brother' },
    { id: '20', value: 'child', label: 'Child' },
    { id: '21', value: 'partner', label: 'Partner' },

    { id: '22', value: 'grandpa', label: 'Grandpa' },

  ];

  maleRelationsEdit = [
    { id: '12', value: 'Father', label: 'Father' },
    { id: '13', value: 'Step-Father', label: 'Step Father' },
    { id: '14', value: 'Caregiver', label: 'Caregiver' },
    { id: '15', value: 'Son', label: 'Son' },
    { id: '16', value: 'Step-Son', label: 'Step Son' },

    { id: '17', value: 'Dependent', label: 'Dependent' },

    { id: '18', value: 'Brother', label: 'Brother' },
    { id: '19', value: 'Step-Brother', label: 'Step Brother' },
    { id: '20', value: 'Child', label: 'Child' },
    { id: '21', value: 'Partner', label: 'Partner' },

    { id: '22', value: 'Grandpa', label: 'Grandpa' },

  ];

  femaleRelations = [
    { id: '1', value: 'mother', label: 'Mother' },
    { id: '2', value: 'step_mother', label: 'Step Mother' },
    { id: '3', value: 'caregiver', label: 'Caregiver' },
    { id: '4', value: 'daughter', label: 'Daughter' },
    { id: '5', value: 'step_daughter', label: 'Step Daughter' },

    { id: '6', value: 'dependent', label: 'Dependent' },

    { id: '7', value: 'sister', label: 'Sister' },
    { id: '8', value: 'step_sister', label: 'Step Sister' },
    { id: '9', value: 'child', label: 'Child' },
    { id: '10', value: 'partner', label: 'Partner' },

    { id: '11', value: 'grandma', label: 'Grandma' },

  ];

  femaleRelationsEdit = [
    { id: '1', value: 'Mother', label: 'Mother' },
    { id: '2', value: 'Step-Mother', label: 'Step Mother' },
    { id: '3', value: 'Caregiver', label: 'Caregiver' },
    { id: '4', value: 'Daughter', label: 'Daughter' },
    { id: '5', value: 'Step-Daughter', label: 'Step Daughter' },

    { id: '6', value: 'Dependent', label: 'Dependent' },

    { id: '7', value: 'Sister', label: 'Sister' },
    { id: '8', value: 'Step-Sister', label: 'Step Sister' },
    { id: '9', value: 'Child', label: 'Child' },
    { id: '10', value: 'Partner', label: 'Partner' },

    { id: '11', value: 'Grandma', label: 'Grandma' },

  ];

  allRelations = [
    { id: '23', value: 'father', label: 'Father' },
    { id: '24', value: 'step_father', label: 'Step Father' },
    { id: '25', value: 'caregiver', label: 'Caregiver' },
    { id: '26', value: 'mother', label: 'Mother' },
    { id: '27', value: 'step_mother', label: 'Step Mother' },
    { id: '28', value: 'step_parent', label: 'Step Parent' },
    { id: '29', value: 'son', label: 'Son' },
    { id: '30', value: 'step_son', label: 'Step Son' },
    { id: '31', value: 'step_child', label: 'Step Child' },
    { id: '31', value: 'daughter', label: 'Daughter' },
    { id: '33', value: 'step_daughter', label: 'Step Daughter' },
    { id: '313', value: 'child', label: 'Child' },
    { id: '34', value: 'brother', label: 'Brother' },
    { id: '35', value: 'step_brother', label: 'Step Brother' },
    { id: '36', value: 'step_sibling', label: 'Step Sibling' },
    { id: '37', value: 'sister', label: 'Sister' },
    { id: '38', value: 'step_sister', label: 'Step Sister' },
    { id: '363', value: 'sibling', label: 'Sibling' },
    { id: '39', value: 'partner', label: 'Partner' },
    { id: '40', value: 'grandparent1', label: 'Grandparent 1' },
    { id: '41', value: 'grandparent2', label: 'Grandparent 2' },
  ];

  allRelationsEdit = [
    { id: '23', value: 'Father', label: 'Father' },
    { id: '24', value: 'Step-Father', label: 'Step Father' },
    { id: '25', value: 'Caregiver', label: 'Caregiver' },
    { id: '26', value: 'Mother', label: 'Mother' },
    { id: '27', value: 'Step-Mother', label: 'Step Mother' },
    { id: '28', value: 'Step-Parent', label: 'Step Parent' },
    { id: '29', value: 'Son', label: 'Son' },
    { id: '30', value: 'Step-Son', label: 'Step Son' },
    { id: '31', value: 'Step-Child', label: 'Step Child' },
    { id: '31', value: 'Daughter', label: 'Daughter' },
    { id: '33', value: 'Step-Daughter', label: 'Step Daughter' },
    { id: '313', value: 'Child', label: 'Child' },
    { id: '34', value: 'Brother', label: 'Brother' },
    { id: '35', value: 'Step-Brother', label: 'Step Brother' },
    { id: '36', value: 'Step-Sibling', label: 'Step Sibling' },
    { id: '37', value: 'Sister', label: 'Sister' },
    { id: '38', value: 'Step-Sister', label: 'Step Sister' },
    { id: '363', value: 'Sibling', label: 'Sibling' },
    { id: '39', value: 'Partner', label: 'Partner' },
    { id: '40', value: 'Grandparent1', label: 'Grandparent 1' },
    { id: '41', value: 'Grandparent2', label: 'Grandparent 2' },
  ];

  relationApiMap: { [key: string]: string } = {
    father: 'sub-admin/addFatherInTree',
    step_father: 'sub-admin/addStepFatherInTree',
    caregiver: 'sub-admin/addFatherInTree',
    mother: 'sub-admin/addMotherInTree',
    step_mother: 'sub-admin/addStepMotherInTree',
    step_parent: 'sub-admin/addStepFatherInTree',
    son: 'sub-admin/addSonInTree',
    step_son: 'sub-admin/addStepSonInTree',
    daughter: 'sub-admin/addDaughterInTree',
    step_child: 'sub-admin/addStepSonInTree',
    step_daughter: 'sub-admin/addStepDaughterInTree',
    child: 'sub-admin/addStepSonInTree',
    brother: 'sub-admin/addBrotherInTree',
    step_brother: 'sub-admin/addStepBrotherInTree',
    step_sibiling: 'sub-admin/addStepBrotherInTree',
    sister: 'sub-admin/addSisterInTree',
    step_sister: 'sub-admin/addStepSisterInTree',
    sibiling: 'sub-admin/addStepBrotherInTree',
    partner: 'sub-admin/addPartnerInTree',
    grandparent1: 'sub-admin/addGrandFatherInTree',
    grandparent2: 'sub-admin/addGrandFatherInTree',

    grandpa: 'sub-admin/addGrandFatherInTree',
    grandma: 'sub-admin/addGrandMotherInTree',
    dependent: 'sub-admin/addStepSonInTree',
  };

  relationEditApiMap: { [key: string]: string } = {
    Father: 'sub-admin/editFatherInTree',
    'Step-Father': 'sub-admin/editStepFatherInTree',
    Caregiver: 'sub-admin/editFatherInTree',
    Mother: 'sub-admin/editMotherInTree',
    'Step-Mother': 'sub-admin/editStepMotherInTree',
    'Step-Parent': 'sub-admin/editStepFatherInTree',
    Son: 'sub-admin/editSonInTree',
    'Step-Son': 'sub-admin/editStepSonInTree',
    Daughter: 'sub-admin/editDaughterInTree',
    'Step-Child': 'sub-admin/editStepSonInTree',
    'Step-Daughter': 'sub-admin/editStepDaughterInTree',
    Child: 'sub-admin/editStepSonInTree',
    'Brother': 'sub-admin/editBrotherInTree',
    'Step-Brother': 'sub-admin/editStepBrotherInTree',
    'Step-Sibiling': 'sub-admin/editStepBrotherInTree',
    Sister: 'sub-admin/editSisterInTree',
    'Step-Sister': 'sub-admin/editStepSisterInTree',
    sibiling: 'sub-admin/editStepBrotherInTree',
    Partner: 'sub-admin/editPartnerInTree',
    Grandparent1: 'sub-admin/addGrandFatherInTree',
    Grandparent2: 'sub-admin/editGrandMotherInTree',

    grandpa: 'sub-admin/editGrandMotherInTree',
    grandma: 'sub-admin/editGrandMotherInTree',
    dependent: 'sub-admin/editStepSonInTree',
  };

  relationId: any = '';

  onRelationChange(event: any): void {
    this.relationId = event.target.value;
  }

  relationCaseId: any = '';

  onRelationCaseChange(event: any): void {
    const selectedValue = event.target.value;
    const selectedRelation = this.filteredRelations.find(relation => relation.value === selectedValue);

    if (selectedRelation) {
      this.relationCaseId = selectedRelation.id;
    }
  }

  relationCaseValue: any = '';

  onRelationCaseChangeEdit(event: any): void {
    const selectedValue = event.target.value;

    const selectedRelation = this.filteredRelationsEdit.find(relation => relation.id === selectedValue);

    if (selectedRelation) {
      this.relationCaseValue = selectedRelation.value;
      this.relationCaseId = selectedRelation.id;
    }
  }

  getFileFromUrl(url: string, filename: string): Promise<File> {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        return new File([blob], filename, { type: blob.type });
      });
  }

  formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }











  getParentId(id: any) {
    this.memberId = id;
    this.initEditParentForm();
  }


  singleMemberDetail: any;

  getSingleMemberData(detail: any) {
    this.memberId = detail.id;
    this.singleMemberDetail = detail;
    this.initEditMemberForm();
    console.log('this.singleMemberDetail', this.singleMemberDetail);

    const isDOBUnknown = this.editMemberForm.get('isDOBUnknown');
    const dobControl = this.singleMemberDetail?.date_of_birth ? this.singleMemberDetail?.date_of_birth : this.editMemberForm.get('dob');
    const isAdultControl = this.editMemberForm.get('isAdult');

    const dobValue = dobControl;
    if (dobValue == 'Above 18' || dobValue == 'Below 18') {
      isDOBUnknown?.setValue(true);
      this.editMemberForm.get('dob')?.disable();
      if (dobValue == 'Above 18') {
        isAdultControl?.setValue(true)
      } else if (dobValue == 'Below 18') {
        isAdultControl?.setValue(false)
      }
    } else {
      isDOBUnknown?.setValue(false);
    }
  }

  @ViewChild('closeModalViewMember') closeModalViewMember!: ElementRef;
  @ViewChild('closeModalViewPet') closeModalViewPet!: ElementRef;
  @ViewChild('closeModalViewParent') closeModalViewParent!: ElementRef;

  getMemberAlbum(name: any) {
    this.closeModalViewMember.nativeElement.click();
    this.closeModalViewParent.nativeElement.click();
    this.route.navigateByUrl(`/admin/main/albums/${this.memberId}`);
    if (name) {
      localStorage.setItem('parentName', name);
    } else {
      localStorage.setItem('parentName', this.filteredOutMembers[0]?.first_name);
    }
  }

  getMemberTimeline(name: any) {
    this.closeModalViewMember.nativeElement.click();
    this.closeModalViewParent.nativeElement.click();
    this.route.navigateByUrl(`/admin/main/timeline/${this.memberId}`);
    if (name) {
      localStorage.setItem('parentName', name);
    } else {
      localStorage.setItem('parentName', this.filteredOutMembers[0]?.first_name);
    }
  }

  getMemberInterview() {
    this.closeModalViewMember.nativeElement.click();
    this.closeModalViewParent.nativeElement.click();
    if (this.singleMemberDetail?.full_name) {
      this.route.navigateByUrl(`/admin/main/member-interview/${this.memberId}/${this.singleMemberDetail?.full_name}`);
    } else {
      this.route.navigateByUrl(`/admin/main/member-interview/${this.memberId}/${this.filteredOutMembers[0]?.user_name}`);
    }
  }

  goToPetList(id: any, name?: any) {
    localStorage.setItem('userIdForPet', this.parentId);
    if (name) {
      localStorage.setItem('parentName', name);
    } else {
      localStorage.setItem('parentName', this.filteredOutMembers[0]?.first_name);
    }
    this.route.navigateByUrl(`/admin/main/pet/${id}`);
  }

  calculateAge(birthDate: string): string {
    const [day, month, year] = birthDate?.split('/')?.map(Number);
    const birth = new Date(year, month - 1, day);
    const today = new Date();

    if (birth > today) {
      return "Invalid birth date (in the future)";
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const daysInLastMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += daysInLastMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} `;
    } else {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
  }





  deleteMemId: any
  familyId: any;

  openDeleteModal(item: any) {
    this.deleteMemId = item.id;
    this.familyId = item.family_id
  }

  @ViewChild('closeModalDel') closeModalDel!: ElementRef;

  btnDelLoader: boolean = false;

  deleteMember() {
    this.btnDelLoader = true;
    const formURlData = new URLSearchParams();
    formURlData.set('family_id', this.familyId);
    formURlData.set('id', this.deleteMemId);
    this.service.postAPI(`sub-admin/deleteNodeFromFamily`, formURlData).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.closeModalDel.nativeElement.click();
          this.getMembers();
          this.btnDelLoader = false;
          this.toastr.success(resp.message);
        } else {
          this.btnDelLoader = false;
          this.toastr.warning(resp.message);
          this.getMembers();
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

  userImg1: any;

  showImg(url: any) {
    this.userImg1 = url;
  }

  getMemberList(item: any) {
    this.route.navigateByUrl(`/admin/main/family-member/${item.user_id}/${item.id}`);
  }

  nextPage() {
    if (this.hasMoreData) {
      this.currentPage++;
      this.getMembers();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getMembers();
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('currentPage');
  }


}
