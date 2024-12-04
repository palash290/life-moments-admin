import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

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
  email: any;
  addMemLoader: boolean = false;
  editMemLoader: boolean = false;
  addPetLoader: boolean = false;
  searchQuery = '';
  loading: boolean = false;

  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;

  constructor(private aRoute: ActivatedRoute, private service: SharedService, private toastr: ToastrService, private route: Router, private location: Location) { }
  backClicked() {
    //this.location.back();
    this.route.navigateByUrl(`/admin/main/member-profile`);
    localStorage.removeItem('itemId');
    localStorage.removeItem('itemEmail');
  }
  ////////////////parent is only edtiting////////////////////
  ngOnInit() {
    this.aRoute.paramMap.subscribe((params) => {
      this.parentId = params.get('parentId');
      this.email = params.get('email');
    });
    localStorage.setItem('itemId', this.parentId)
    localStorage.setItem('itemEmail', this.email)


    this.initNewMemberForm();
    this.initNewPetForm();
    this.initEditMemberForm();
    this.initEditParentForm();
    this.initEditPetForm();
    this.getMembers();

    this.newMemberForm.get('gender')?.valueChanges.subscribe((gender) => {
      debugger
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
      debugger
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


  // getMembers() {
  //   this.service.getApi(`sub-admin/get-all-members/${this.parentId}`).subscribe({
  //     next: (resp) => {
  //       this.data = resp.data; // Add `checked: false` to each user
  //     },
  //     error: (error) => {
  //       console.log(error.message);
  //     }
  //   });
  // }
  allMemberList: any;
  filteredOutMembers: any[] = [];
  parentDetail: any;

  getMembers() {
    this.loading = true;
    this.service.getApi(`sub-admin/get-all-members/${this.parentId}`).subscribe({
      next: (resp) => {
        this.loading = false;
        this.allMemberList = resp.data;
        // Filter data based on `relation_member_id`
        this.data = resp.data.filter((item: { relation_member_id: number; }) => item.relation_member_id !== 0);

        // Save filtered-out items in a separate variable
        this.filteredOutMembers = resp.data.filter((item: { relation_member_id: number; }) => item.relation_member_id === 0);
        //console.log('this.filteredOutMembers', this.filteredOutMembers);
        this.parentDetail = this.filteredOutMembers;
        // Optional: Add `checked: false` property to each user in `this.data`
        this.data.forEach(user => user.checked = false);
      },
      error: (error) => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }


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
    this.filteredRelations = [...this.allRelations];
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
      name: new FormControl(this.singleMemberDetail?.full_name, Validators.required),
      dName: new FormControl(this.singleMemberDetail?.user_name, Validators.required),
      gender: new FormControl(this.singleMemberDetail?.gender, Validators.required),
      dob: new FormControl(this.convertDateFormat(this.singleMemberDetail?.date_of_birth), Validators.required),
      isAlive: new FormControl(this.singleMemberDetail?.is_alive, Validators.required),
      relationName: new FormControl(this.singleMemberDetail?.relation_id, Validators.required),
      relationWith: new FormControl(this.singleMemberDetail?.relationWith.id, Validators.required),
    })
    // Set initial filteredRelationsEdit based on the current gender
    const initialGender = this.singleMemberDetail?.gender;
    if (initialGender === 'male') {
      this.filteredRelationsEdit = [...this.maleRelationsEdit];
    } else if (initialGender === 'female') {
      this.filteredRelationsEdit = [...this.femaleRelationsEdit];
    } else {
      this.filteredRelationsEdit = [...this.allRelationsEdit];
    }

    // Subscribe to gender changes to dynamically filter relations
    this.editMemberForm.get('gender')?.valueChanges.subscribe((gender) => {
      console.log('Edit Member Form - Gender Changed:', gender); // Debug log
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




  //   checked
  // : 
  // false
  // created_at
  // : 
  // "2024-12-03T00:51:01.000Z"
  // date_of_birth
  // : 
  // "21/06/2000"
  // displayName
  // : 
  // null
  // family_id
  // : 
  // 744
  // first_name
  // : 
  // "Nehru"
  // full_name
  // : 
  // "Azalia Smith"
  // gender
  // : 
  // "unknown"
  // has_child
  // : 
  // "N"
  // id
  // : 
  // 3088
  // image_link
  // : 
  // "http://18.229.202.71:4000/images/1733187058786.jpg"
  // interview_popup
  // : 
  // 0
  // is_alive
  // : 
  // 2
  // is_edit
  // : 
  // 0
  // last_inserted
  // : 
  // "Y"
  // last_name
  // : 
  // "Odom"
  // level_at_tree
  // : 
  // 5
  // marital_status
  // : 
  // "S"
  // other_gender
  // : 
  // "none"
  // paw_popup
  // : 
  // 0
  // popup_status
  // : 
  // 0
  // relationName
  // : 
  // "Son"
  // relationWith
  // : 
  // {id: 3087, family_id: 744, user_id: 324, user_name: 'Channing Rios', level_at_tree: 4, …}
  // relation_id
  // : 
  // 3087
  // relation_member_id
  // : 
  // 3087
  // updated_at
  // : 
  // "2024-12-03T00:51:01.000Z"
  // user_id
  // : 
  // 324
  // user_name
  // : 
  // "Nehru Odom"

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
      name: new FormControl(this.filteredOutMembers[0]?.full_name, Validators.required),
      dName: new FormControl(this.filteredOutMembers[0]?.user_name, Validators.required),
      gender: new FormControl(this.filteredOutMembers[0]?.gender, Validators.required),
      dob: new FormControl(this.convertDateFormat(this.filteredOutMembers[0]?.date_of_birth), Validators.required),
      //isAlive: new FormControl(this.filteredOutMembers[0]?.is_alive, Validators.required),
      //relationName: new FormControl('', Validators.required),
      //relationWith: new FormControl('', Validators.required),
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
      this.newMemberForm.get('dob')?.disable();
    } else {
      this.newMemberForm.get('isAdult')?.disable();
      this.newMemberForm.get('dob')?.enable();
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
    { id: '21', value: 'parent', label: 'Parent' },

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
    { id: '21', value: 'Parent', label: 'Parent' },

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
    { id: '10', value: 'parent', label: 'Parent' },

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
    { id: '10', value: 'Parent', label: 'Parent' },

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
    { id: '39', value: 'parent', label: 'Parent' },
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
    { id: '39', value: 'Parent', label: 'Parent' },
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
    Parent: 'sub-admin/editPartnerInTree',
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

    // Find the selected relation object
    const selectedRelation = this.filteredRelations.find(relation => relation.value === selectedValue);

    if (selectedRelation) {
      console.log('Selected Relation:', selectedRelation); // Logs the entire object
      console.log('ID:', selectedRelation.id); // Logs the relation ID
      console.log('Label:', selectedRelation.value); // Logs the relation label
      this.relationCaseId = selectedRelation.id;
    }
  }

  relationCaseValue: any = '';

  // Handling relationName change in edit form
  onRelationCaseChangeEdit(event: any): void {
    const selectedValue = event.target.value;

    // Find the selected relation object
    const selectedRelation = this.filteredRelationsEdit.find(relation => relation.id === selectedValue);

    if (selectedRelation) {
      console.log('Selected Relation for Edit:', selectedRelation); // Logs the entire object
      console.log('ID:', selectedRelation.id); // Logs the relation ID
      console.log('Label:', selectedRelation.value); // Logs the relation label
      this.relationCaseValue = selectedRelation.value;
      this.relationCaseId = selectedRelation.id;
      // // Optionally set the entire object in the edit form
      // this.editMemberForm.patchValue({
      //   relationName: selectedRelation, // Store the entire object
      // });
    }
  }



  addNewMember(): void {
    this.newMemberForm.markAllAsTouched();
    if (this.newMemberForm.valid) {
      debugger
      const selectedRelation = this.newMemberForm.value.relationName;
      const apiUrl = `${this.relationApiMap[selectedRelation]}`;

      if (!apiUrl) {
        this.toastr.error('Invalid relation selected.');
        return;
      }

      this.addMemLoader = true;
      const formURlData = new FormData();
      if (this.parentImage) {
        formURlData.append('file', this.parentImage);
      }
      formURlData.set('id', this.relationId);
      formURlData.set('family_id', this.parentDetail[0]?.family_id);
      formURlData.set('user_id', this.parentId);

      const userName = this.newMemberForm.value.name || '';
      const [firstName, ...lastNameParts] = userName.split(' '); // Split by space
      const lastName = lastNameParts.join(' '); // Join the rest as last name

      formURlData.set('user_name', this.newMemberForm.value.dName);

      formURlData.set('first_name', firstName);
      formURlData.set('last_name', lastName);
      formURlData.set('full_name', userName);
      formURlData.set('other_gender', 'none');

      formURlData.set('gender', this.newMemberForm.value.gender);
      // formURlData.set('dob', this.newMemberForm.value.dob);
      const dob = this.newMemberForm.value.dob;

      const isDOBUnknown = this.newMemberForm.get('isDOBUnknown')?.value;
      if (!isDOBUnknown) {
        if (dob) {
          const formattedDOB = this.formatDateToDDMMYYYY(dob);
          formURlData.set('dob', formattedDOB);
        }
      }

      formURlData.set('is_alive', this.newMemberForm.value.isAlive);
      formURlData.set('relation_id', this.relationCaseId);
      // if (this.newMemberForm.value.isAdult) {
      //   formURlData.set('18+', this.newMemberForm.value.isAdult);
      // }

      this.service.postAPIFormData(apiUrl, formURlData).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.addMemLoader = false;
            this.closeModalAdd.nativeElement.click();
            this.parentImage1 = null;
            this.relationId = '';
            this.relationCaseId = '';
            this.getMembers();
          } else {
            this.toastr.warning(resp.message);
            this.addMemLoader = false;
            this.getMembers();
          }
        },
        error: (error) => {
          this.getMembers();
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

  formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }



  @ViewChild('closeModalEditMember') closeModalEditMember!: ElementRef;

  editmember(): void {
    this.editMemberForm.markAllAsTouched();
    if (this.editMemberForm.valid) {
      console.log('Form Values:', this.editMemberForm.value);

      const selectedRelation = this.relationCaseValue;
      const apiUrl = this.relationEditApiMap[selectedRelation];

      if (!apiUrl) {
        this.toastr.error('Invalid relation selected.');
        return;
      }

      this.editMemLoader = true;
      const formURlData = new FormData();
      if (this.editMemberProfile) {
        formURlData.append('file', this.editMemberProfile);
      }

      if (this.relationId) {
        formURlData.set('id', this.relationId);
      } else {
        formURlData.set('id', this.singleMemberDetail?.relationWith.id)
      }

      formURlData.set('family_id', this.parentDetail[0]?.family_id);
      formURlData.set('user_id', this.parentId);

      const userName = this.editMemberForm.value.name || '';
      const [firstName, ...lastNameParts] = userName.split(' '); // Split by space
      const lastName = lastNameParts.join(' '); // Join the rest as last name

      formURlData.set('user_name', this.editMemberForm.value.dName);

      formURlData.set('first_name', firstName);
      formURlData.set('last_name', lastName);
      formURlData.set('full_name', userName);
      formURlData.set('other_gender', 'none');

      formURlData.set('gender', this.editMemberForm.value.gender);
      // formURlData.set('dob', this.editMemberForm.value.dob);
      const dob = this.editMemberForm.value.dob;

      const isDOBUnknown = this.editMemberForm.get('isDOBUnknown')?.value;
      if (!isDOBUnknown) {
        if (dob) {
          const formattedDOB = this.formatDateToDDMMYYYY(dob);
          formURlData.set('dob', formattedDOB);
        }
      }

      formURlData.set('is_alive', this.editMemberForm.value.isAlive);
      formURlData.set('relation_id', this.relationCaseId);
      formURlData.set('oldid', this.memberId);

      this.service.postAPIFormData(apiUrl, formURlData).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.editMemLoader = false;
            this.closeModalEditMember.nativeElement.click();
            this.parentImage1 = null;
            this.relationId = '';
            this.relationCaseId = '';
            this.getMembers();
          } else {
            this.toastr.warning(resp.message);
            this.editMemLoader = false;
            this.getMembers();
          }
        },
        error: (error) => {
          this.getMembers();
          this.editMemLoader = false;
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

  addParentLoader: boolean = false;
  @ViewChild('closeModalEditParent') closeModalEditParent!: ElementRef;

  editParent(): void {
    this.editParentForm.markAllAsTouched();
    if (this.editParentForm.valid) {
      console.log('Form Values:', this.editParentForm.value);
      this.addParentLoader = true;
      const formURlData: any = new FormData();
      if (this.editParentProfile) {
        formURlData.append('avatar', this.editParentProfile);
      }
      formURlData.set('full_name', this.editParentForm.value.name);
      formURlData.set('displayName', this.editParentForm.value.dName);
      //formURlData.set('birth', this.editParentForm.value.dob);

      const dob = this.editParentForm.value.dob;

      const isDOBUnknown = this.newMemberForm.get('isDOBUnknown')?.value;
      if (!isDOBUnknown) {
        if (dob) {
          const formattedDOB = this.formatDateToDDMMYYYY(dob);
          formURlData.set('birth', formattedDOB);
        }
      }

      formURlData.set('user_id', this.parentId);

      formURlData.set('onboardingDone', null);
      formURlData.set('gender', this.editParentForm.value.gender);
      if (this.editParentForm.value.gender == 'prefer-not-to-say') {
        formURlData.set('other_gender', 'prefer-not-to-say');
      } else {
        formURlData.set('other_gender', null);
      }


      this.service.postAPIFormData('sub-admin/editProfile', formURlData).subscribe({
        next: (resp) => {
          if (resp.id) {
            this.toastr.success('Details updated successfully!');
            this.addParentLoader = false;
            this.closeModalEditParent.nativeElement.click();
            this.parentImage1 = null;
            this.getMembers();
          } else {
            this.toastr.warning(resp.message);
            this.addParentLoader = false;
            this.getMembers();
          }
        },
        error: (error) => {
          this.getMembers();
          this.addParentLoader = false;
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

  getParentId(id: any) {
    this.memberId = id;
    this.initEditParentForm();
  }


  singleMemberDetail: any
  getSingleMemberData(detail: any) {
    this.memberId = detail.id;
    this.singleMemberDetail = detail;
    this.initEditMemberForm();
    console.log('this.singleMemberDetail', this.singleMemberDetail);
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

  getMemberTimeline() {
    this.closeModalViewMember.nativeElement.click();
    this.closeModalViewPet.nativeElement.click();
    this.closeModalViewParent.nativeElement.click();
    this.route.navigateByUrl(`/admin/main/timeline/${this.memberId}`);
  }


  calculateAge(birthDate: string): string {
    // Parse the birthDate string in dd-mm-yyyy format
    const [day, month, year] = birthDate?.split('/')?.map(Number);
    const birth = new Date(year, month - 1, day); // Adjust for 0-based month index
    const today = new Date();

    // Check if the birth date is in the future
    if (birth > today) {
      return "Invalid birth date (in the future)";
    }

    // Calculate the difference in years, months, and days
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const daysInLastMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += daysInLastMonth;
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    // Return the result
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      // return `${months} month${months > 1 ? 's' : ''} old${days > 0 ? ` and ${days} day${days > 1 ? 's' : ''}` : ''}`;
      return `${months} month${months > 1 ? 's' : ''} `;
    } else {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
  }





  goToPetList(id: any) {
    localStorage.setItem('userIdForPet', this.parentId);
    this.route.navigateByUrl(`/admin/main/pet/${id}`);
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


}

