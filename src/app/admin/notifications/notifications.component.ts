import { Component } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Editor, Toolbar } from 'ngx-editor';
declare const $: any; // To use jQuery
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

  selectedMembers: number[] = [];
  selectedMembersId: any;
  selectedOption: string = 'Individual';
  selectedNotification: string = 'app';
  about_us: any = '';
  editor1!: Editor;
  loading: boolean = false;
  selectedPlanId: any = '';
  selectedPetId: any = '';

  constructor(private service: SharedService, private toastr: ToastrService) { }

  ngOnInit() {
    this.editor1 = new Editor();
    this.onOptionChange()
    this.service.getApi('sub-admin/get-users').subscribe(response => {
      if (response.success) {
        this.members = response.data;
        if (this.members.length > 0) {
          this.memberId = this.members[0].id;
        }
      }
    });
  }

  // name = 'Angular';
  // editor = ClassicEditor;
  // data: any = `<p>Hello, world!</p>`;

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


  members: any;
  memberId: any;


  // ngAfterViewChecked(): void {
  //   // Reinitialize Select2 when "Individual" dropdown is shown
  //   if (this.selectedOption === 'Individual' && !this.isSelect2Initialized) {
  //     setTimeout(() => {
  //       $('#membersSelect')
  //         .select2({
  //           placeholder: 'Select members',
  //           allowClear: true,
  //         })
  //         .on('change', (event: any) => {
  //           this.selectedMembers = $(event.target).val();
  //           const selectedIdsAsNumbers = this.selectedMembers.map((id: any) => parseInt(id, 10));
  //           console.log(selectedIdsAsNumbers);
  //         });
  //       this.isSelect2Initialized = true; // Mark Select2 as initialized
  //     });
  //   } else if (this.selectedOption !== 'Individual') {
  //     // Destroy Select2 when hiding "Individual" dropdown
  //     if (this.isSelect2Initialized) {
  //       $('#membersSelect').select2('destroy');
  //       this.isSelect2Initialized = false;
  //     }
  //   }
  // }

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
    if (this.selectedOption === 'Individual' && (!this.selectedMembersId || this.selectedMembersId.length === 0)) {
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

    if (this.selectedOption === 'Individual') {
      const selectedMembersArray = this.selectedMembersId.map((id: string) => parseInt(id, 10));
      formURlData.set('user_id', selectedMembersArray);
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


}
