import { Component, HostListener } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Editor, Toolbar } from 'ngx-editor';
declare const $: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

  // selectedMembers: number[] = [];
  selectedMembersId: any;
  selectedOption: string = 'Individual';
  selectedNotification: string = 'both';
  about_us: any = '';
  editor1!: Editor;
  loading: boolean = false;
  loading12: boolean = false;
  selectedPlanId: any = '';
  selectedPetId: any = '';
  maxDate: any;

  filter = {
    date_of_birth: '',
    search: '',
    is_alive: '',
    ageGroup: ''
  };

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.editor1 = new Editor();
    this.onOptionChange()
    this.getMembers();
    this.setMaxDate();
    this.getUserWithName();
    // const formURlData = new URLSearchParams();
    // formURlData.set('date_of_birth', '');
    // formURlData.set('search', '');
    // formURlData.set('is_alive', '');

    // this.service.postAPI('sub-admin/get-users-for-notification', formURlData).subscribe(response => {
    //   if (response.success) {
    //     this.members = response.data;
    //     if (this.members.length > 0) {
    //       this.memberId = this.members[0].id;
    //     }
    //   }
    // });
  }

  getUserWithName() {
    this.service.getApi('sub-admin/get-all-users-with-count').subscribe(response => {
      if (response.success) {
        this.languages = response.data;
      }
    });
  }

  onAgeGroupChange() {
    if (this.filter.ageGroup !== '') {
      this.filter.date_of_birth = '';
    }
    //this.applyFilters();
  }

  getMembers() {
    const formURlData = new URLSearchParams();

    if (this.filter.ageGroup && this.filter.ageGroup !== '') {
      formURlData.set('date_of_birth', this.filter.ageGroup);
    } else if (this.filter.date_of_birth) {
      //formURlData.set('date_of_birth', this.filter.date_of_birth);
      const dateParts = this.filter.date_of_birth.split('-'); // Split by hyphen (YYYY-MM-DD)
      const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Convert to DD/MM/YYYY
      formURlData.set('date_of_birth', formattedDate);

    }

    formURlData.set('search', this.filter.search);

    if (this.filter.is_alive) {
      formURlData.set('is_alive', this.filter.is_alive);
    }

    this.loading12 = true;

    this.service.postAPI('sub-admin/get-users-for-notification', formURlData).subscribe({
      next: (resp) => {
        this.loading12 = false;
        if (resp.success) {
          this.members = resp.data;
        } else {
          this.members = [];
          //this.toastr.warning(resp.message);
        }
      },
      error: (error) => {
        this.loading12 = false;
        this.members = [];
        // if (error.error.message) {
        //   this.toastr.error(error.error.message);
        // } else {
        //   this.toastr.error('Something went wrong!');
        // }
      }
    });
  }


  limit: number = 10;
  offset: number = 1;
  hasMoreData: boolean = true;

  // getMembers() {
  //   if (!this.hasMoreData) return;

  //   const formURlData = new URLSearchParams();

  //   if (this.filter.ageGroup && this.filter.ageGroup !== '') {
  //     formURlData.set('date_of_birth', this.filter.ageGroup);
  //   } else if (this.filter.date_of_birth) {
  //     formURlData.set('date_of_birth', this.filter.date_of_birth);
  //   }

  //   formURlData.set('search', this.filter.search || '');

  //   if (this.filter.is_alive) {
  //     formURlData.set('is_alive', this.filter.is_alive);
  //   }

  //   formURlData.set('limit', this.limit.toString());
  //   formURlData.set('offset', this.offset.toString());

  //   if (!this.isSearchLoad) {
  //     //this.loading12 = true;
  //   }

  //   this.service.postAPI('sub-admin/get-users-for-notification', formURlData).subscribe({
  //     next: (resp) => {
  //       this.loading12 = false;
  //       if (resp.success && resp.data.length > 0) {
  //         this.members = [...this.members, ...resp.data];
  //         this.offset += this.limit;
  //       } else {
  //         this.hasMoreData = false;
  //       }
  //     },
  //     error: (error) => {
  //       this.loading12 = false;
  //       this.hasMoreData = false;
  //     }
  //   });
  // }

  // onScroll() {
  //   if (this.hasMoreData) {
  //     this.getMembers();
  //   }
  // }





  //isSearchLoad: boolean = false;


  applyFilters() {
    if (this.filter.date_of_birth == '' && this.filter.search == '' && this.filter.is_alive == '' && this.filter.ageGroup == '') {
      return
    }
    this.selectedMembers = [];
    this.selectAll = false;
    this.getMembers();
  }

  resetFilters() {
    if (this.filter.date_of_birth == '' && this.filter.search == '' && this.filter.is_alive == '' && this.filter.ageGroup == '') {
      return
    }
    this.filter = {
      date_of_birth: '',
      search: '',
      is_alive: '',
      ageGroup: ''
    };
    this.getMembers();
  }

  toolbar1: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code'],
    //['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    // or, set options for link:
    //[{ link: { showOpenInNewTab: false } }, 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    ['superscript', 'subscript'],
    ['undo', 'redo'],
  ];

  members: any[] = [];
  memberId: any;

  onOptionChange(): void {
    // Reset Select2 if switching to Individual
    if (this.selectedOption === 'Individual') {
      setTimeout(() => {
        if ($('#membersSelect').data('select2')) {
          $('#membersSelect').select2('destroy'); // Destroy previous instance if it exists
        }

        $('#membersSelect')
          .select2({
            placeholder: 'Select members',
            allowClear: true,
          })
          .on('change', (event: any) => {
            this.selectedMembers = $(event.target).val();
            const selectedIdsAsNumbers = this.selectedMembers.map((id: any) => parseInt(id, 10));
            console.log(selectedIdsAsNumbers);
            this.selectedMembersId = selectedIdsAsNumbers;
          });
      });
    }

    // If switching away from Individual, clean up Select2
    if (this.selectedOption !== 'Individual' && $('#membersSelect').data('select2')) {
      $('#membersSelect').select2('destroy');
      this.selectedPlanId = '';
    }
  }

  title: any;

  onIndividualUpdate() {
    // if (/^(<p><\/p>)+$/.test(this.about_us.replace(/\s+/g, ''))) {
    //   this.toastr.error('Message field should not be empty.');
    //   return;
    // }

    // Check for spaces in current_password and new_password
    const title = this.title?.trim();
    const about_us = this.about_us?.trim();

    if (!title || !about_us) {
      //this.toastr.warning('Passwords cannot be empty or just spaces.');
      return;
    }

    // Validate required fields
    if (!this.about_us || !this.title) {
      this.toastr.error('Message and title fields cannot be empty.');
      return;
    }

    // Additional validations based on the selected option
    // if (this.selectedOption === 'Individual' && (!this.selectedMembersId || this.selectedMembersId.length === 0)) {
    //   this.toastr.error('Please select at least one member for Individual notifications.');
    //   return;
    // }

    // Additional validations based on the selected option
    if (this.selectedOption === 'Individual' && (this.selectedMembers.length === 0)) {
      this.toastr.error('Please select at least one member for Individual notifications.');
      return;
    }

    // if (this.selectedOption === 'Group' && !this.selectedPlanId) {
    //   this.toastr.error('Please select a plan for Group notifications.');
    //   return;
    // }

    this.loading = true;


    const formURlData = new FormData();
    if (this.parentImage1) {
      formURlData.append('avatar', this.parentImage);
    }


    const htmlContentAbout = `${this.about_us}`;

    formURlData.set('notification_type', this.selectedNotification);

    formURlData.set('message', htmlContentAbout);

    formURlData.set('user_type', this.selectedOption);

    formURlData.set('title', this.title);

    if (this.selectedOption === 'Group') {
      formURlData.set('plan_id', this.selectedPlanId);
    }

    // if (this.selectedOption === 'Individual') {
    //   const selectedMembersArray = this.selectedMembersId.map((id: string) => parseInt(id, 10));
    //   formURlData.set('user_id', selectedMembersArray);
    // }
    // if (this.selectedOption === 'Individual') {
    //   // If 'Select All' is checked, send all member IDs
    //   const selectedMembersArray = this.selectAll ? this.members.map((member: any) => member.id) : this.selectedMembers;
    //   formURlData.set('user_id', selectedMembersArray);
    // }
    if (this.selectedOption === 'Individual') {
      // If 'Select All' is checked, send all member IDs
      const selectedMembersArray = this.selectAll
        ? [...new Set(this.members.map((member: any) => member.user_id))]  // Remove duplicates
        : [...new Set(this.selectedMembers)];  // Remove duplicates from individual selection

      formURlData.set('user_id', selectedMembersArray.join(','));
    }


    this.service.postAPIFormData('sub-admin/send-notification', formURlData).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.parentImage1 = null;
          this.title = '';
          this.about_us = '';
          this.selectedPlanId = [];
        } else {
          this.toastr.warning(resp.message);
          this.loading = false;
        }
      },
      error: error => {
        this.loading = false;
        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    });
  }




  onGroupUpdate() {
    // if (/^(<p><\/p>)+$/.test(this.about_us.replace(/\s+/g, ''))) {
    //   this.toastr.error('Message field should not be empty.');
    //   return;
    // }

    const title = this.title?.trim();
    const about_us = this.about_us?.trim();

    if (!title || !about_us) {
      //this.toastr.warning('Passwords cannot be empty or just spaces.');
      return;
    }

    // Validate required fields
    if (!this.about_us || !this.title) {
      this.toastr.error('Message and title fields cannot be empty.');
      return;
    }


    if (this.selectedOption === 'Group' && !this.selectedPlanId) {
      this.toastr.error('Please select a plan for Group notifications.');
      return;
    }

    this.loading = true;

    const formURlData = new FormData();
    if (this.parentImage1) {
      formURlData.append('avatar', this.parentImage);
    }

    const htmlContentAbout = `${this.about_us}`;

    formURlData.set('notification_type', this.selectedNotification);

    formURlData.set('message', htmlContentAbout);

    formURlData.set('user_type', this.selectedOption);

    formURlData.set('title', this.title);

    formURlData.set('plan_id', this.selectedPlanId);

    this.service.postAPIFormData('sub-admin/send-notification', formURlData).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.parentImage1 = null;
          this.title = '';
          this.about_us = '';
          this.parentImage1 = null;
        } else {
          this.toastr.warning(resp.message);
          this.loading = false;
        }
      },
      error: error => {
        this.loading = false;
        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    });
  }


  onPetsUpdate() {
    // if (/^(<p><\/p>)+$/.test(this.about_us.replace(/\s+/g, ''))) {
    //   this.toastr.error('Message field should not be empty.');
    //   return;
    // }

    const title = this.title?.trim();
    const about_us = this.about_us?.trim();

    if (!title || !about_us) {
      //this.toastr.warning('Passwords cannot be empty or just spaces.');
      return;
    }

    // Validate required fields
    if (!this.about_us || !this.title) {
      this.toastr.error('Message and title fields cannot be empty.');
      return;
    }

    if (this.selectedOption === 'Pets' && !this.selectedPetId) {
      this.toastr.error('Please select a plan for Group notifications.');
      return;
    }

    this.loading = true;

    const formURlData = new FormData();
    if (this.parentImage1) {
      formURlData.append('avatar', this.parentImage);
    }

    const htmlContentAbout = `${this.about_us}`;

    formURlData.set('notification_type', this.selectedNotification);

    formURlData.set('message', htmlContentAbout);

    formURlData.set('user_type', 'User wiih pets');

    formURlData.set('title', this.title);

    formURlData.set('pets_type', this.selectedPetId);

    this.service.postAPIFormData('sub-admin/send-notification', formURlData).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.parentImage1 = null;
          this.title = '';
          this.about_us = '';
          this.parentImage1 = null;
        } else {
          this.toastr.warning(resp.message);
          this.loading = false;
        }
      },
      error: error => {
        this.loading = false;
        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    });
  }

  from: any;
  to: any;

  onNameUpdate() {

    const title = this.title?.trim();
    const about_us = this.about_us?.trim();

    if (!title || !about_us) {
      //this.toastr.warning('Passwords cannot be empty or just spaces.');
      return;
    }

    // Validate required fields
    if (!this.about_us || !this.title) {
      this.toastr.error('Message and title fields cannot be empty.');
      return;
    }

    if (this.selectedOption === 'Name' && !this.from && !this.to) {
      this.toastr.error('Please select both dates for notifications.');
      return;
    }

    this.loading = true;

    const formURlData = new FormData();
    if (this.parentImage1) {
      formURlData.append('avatar', this.parentImage);
    }

    const htmlContentAbout = `<div style="font-family: "Open Sans", serif !important; font-size: 12px;">${this.about_us}</div>`;

    formURlData.set('notification_type', this.selectedNotification);

    formURlData.set('message', htmlContentAbout);

    formURlData.set('user_type', 'date of birth range');

    formURlData.set('title', this.title);

    //formURlData.set('user_id', this.languageId);
    formURlData.set('start_date', this.from);
    formURlData.set('end_date', this.to);

    const fromDate = this.from.split('-'); // Split by hyphen (YYYY-MM-DD)
    const formattedDateFrom = `${fromDate[2]}/${fromDate[1]}/${fromDate[0]}`; // Convert to DD/MM/YYYY
    formURlData.set('start_date', formattedDateFrom);

    const toDate = this.to.split('-'); // Split by hyphen (YYYY-MM-DD)
    const formattedDateTo = `${toDate[2]}/${toDate[1]}/${toDate[0]}`; // Convert to DD/MM/YYYY
    formURlData.set('end_date', formattedDateTo);


    this.service.postAPIFormData('sub-admin/send-notification', formURlData).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.toastr.success(resp.message);
          this.loading = false;
          this.parentImage1 = null;
          this.title = '';
          this.about_us = '';
          this.parentImage1 = null;
          this.from = '';
          this.to = '';
          //this.getUserWithName();
        } else {
          this.toastr.warning(resp.message);
          this.loading = false;
        }
      },
      error: error => {
        this.loading = false;
        if (error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Something went wrong!');
        }
      }
    });
  }


  parentImage1: any;
  parentImage!: File;

  onImageSelected(event: Event, type: any): void {
    const inputElement = event.target as HTMLInputElement;
    const file = (event.target as HTMLInputElement).files?.[0];


    if (inputElement.files && inputElement.files.length > 0) {
      this.parentImage = inputElement.files[0];
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.parentImage1 = reader.result;
        // this.newMemberForm.patchValue({ image: file });
        // this.newMemberForm.get('image')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }


  showEmojiPicker = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set: any = 'twitter';

  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  // Listen for clicks on the document
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    // Close emoji picker if clicked outside
    if (this.showEmojiPicker && !target.closest('.emoji-mart') && !target.closest('.ct_emoji_icon_position')) {
      this.showEmojiPicker = false;
    }
  }

  addEmoji(event: any) {
    if (!this.editor1 || !this.editor1.view) return;

    const { view } = this.editor1;
    const { state, dispatch } = view;
    const { selection } = state;
    const emoji = event.emoji.native;

    // Insert emoji at the cursor position
    dispatch(state.tr.insertText(emoji, selection.from, selection.to));

    // Keep the focus on the editor
    setTimeout(() => {
      view.focus();
    }, 0);
  }


  selectedMembers: number[] = [];
  selectAll: boolean = false;

  toggleSelection(memberId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedMembers.push(memberId);
    } else {
      this.selectedMembers = this.selectedMembers.filter(user_id => user_id !== memberId);
    }

    this.updateSelectAllStatus();
  }

  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    this.selectAll = isChecked;
    this.selectedMembers = isChecked ? this.members.map((member: { user_id: any; }) => member.user_id) : [];
  }

  updateSelectAllStatus() {
    this.selectAll = this.selectedMembers.length === this.members.length;
  }

  // logSelectedMembers() {
  //   console.log("Selected Member IDs:", this.selectedMembers);
  // }

  languages: any;
  languageId: any;

  onLanguageChange(event: any): void {
    const selectedId = event.target.value;
    const selectedCategory = this.languages.find((language: { user_id: any; }) => language.user_id == selectedId);

    //const selectedCategory = this.categories.find(category => category.id === event.value);

    if (selectedCategory) {
      this.languageId = selectedCategory.user_id;

      //this.getPrivacy(this.languageId)

    }
  }

  setMaxDate() {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }


}
