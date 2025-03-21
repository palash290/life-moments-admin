import { Component, HostListener } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-notification-contant',
  templateUrl: './notification-contant.component.html',
  styleUrl: './notification-contant.component.css'
})
export class NotificationContantComponent {

  loading: boolean = false;
  selectedOptionInterview: any;
  selectedOptionFamily: any;
  selectedOptionPaywall: any;
  selectedNotification: string = 'Interviews';
  title: any;
  editor1!: Editor;
  about_us: any = '';
  showForm: boolean = false;
  eventCategory: any;
  category: any;
  contant: any;
  prerequisiteId: any;


  constructor(private service: SharedService, private toastr: ToastrService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.editor1 = new Editor();
    this.getEventCategory();
    this.getCategory();
  }

  getEventCategory() {
    const formURlData = new URLSearchParams();
    formURlData.set('category', 'Pre Paywall');
    this.service.postAPI('sub-admin/get-trigger-event-by-category', formURlData).subscribe({
      next: resp => {
        this.eventCategory = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getEventById(id: any) {
    this.showForm = true;
    const formURlData = new URLSearchParams();
    formURlData.set('id', id);
    this.service.postAPI('sub-admin/get-trigger-event-notification-by-id', formURlData).subscribe({
      next: resp => {
        this.title = resp.data[0]?.title;
        this.about_us = resp.data[0]?.content;
        this.prerequisiteId = resp.data[0]?.id;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getCategory() {
    this.service.getApi('sub-admin/get-trigger-event-category').subscribe({
      next: resp => {
        this.category = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
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

  interviewBack() {
    this.selectedOptionInterview = '';
    this.showForm = false;
  }

  familyBack() {
    this.selectedOptionFamily = '';
    this.showForm = false;
  }

  paywallBack() {
    this.selectedOptionPaywall = '';
    this.showForm = false;
  }

  reset() {
    this.selectedOptionInterview = '';
    this.selectedOptionFamily = '';
    this.selectedOptionPaywall = '';
    this.showForm = false;
  }




  saveInterview() {

    const title = this.title?.trim();
    const about_us = this.about_us?.trim();

    if (!title || !about_us) {
      //this.toastr.warning('Passwords cannot be empty or just spaces.');
      return;
    }

    if (!this.about_us || !this.title) {
      this.toastr.error('Message and title fields cannot be empty.');
      return;
    }

    this.loading = true;

    const formURlData = new URLSearchParams();

    //const htmlContentAbout = `${this.about_us}`;

  // Decode the HTML entities back to normal
  const textArea = document.createElement('textarea');
  textArea.innerHTML = about_us;
  const about_us1 = textArea.value;



    formURlData.set('id', this.prerequisiteId)

    formURlData.set('content', about_us1);

    formURlData.set('title', this.title);

    this.service.postAPI('sub-admin/update-trigger-event-notification', formURlData).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.toastr.success(resp.message);
          this.loading = false;
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


}
