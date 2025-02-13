import { Component } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent {

  selectedEditor = 'about_us';
  about_us: any = '';
  privacyResult: any = '';
  termsResult: any = '';
  languages: any;
  languageId: any;
  editor1!: Editor;
  editor2!: Editor;
  editor3!: Editor;

  constructor(private service: SharedService, private toastr: ToastrService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.editor1 = new Editor();
    this.editor2 = new Editor();
    this.editor3 = new Editor();

    this.service.getApi('sub-admin/get-language').subscribe(response => {
      if (response.success) {
        this.languages = response.data;
        if (this.languages.length > 0) {
          this.languageId = this.languages[0].code;
        }
      }
    });

    this.getPrivacy('en');
  }

  toolbar1: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code'],
    //['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    //['link', 'image'],
    // or, set options for link:
    //[{ link: { showOpenInNewTab: false } }, 'image'],
    ['text_color', 'background_color'],
    //['align_left', 'align_center', 'align_right', 'align_justify'],
    //['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    //['superscript', 'subscript'],
    ['undo', 'redo'],
  ];
  toolbar2: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code'],
    //['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    //['link', 'image'],
    // or, set options for link:
    //[{ link: { showOpenInNewTab: false } }, 'image'],
    ['text_color', 'background_color'],
    //['align_left', 'align_center', 'align_right', 'align_justify'],
    //['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    //['superscript', 'subscript'],
    ['undo', 'redo'],
  ];
  toolbar3: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code'],
    //['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    //['link', 'image'],
    // or, set options for link:
    //[{ link: { showOpenInNewTab: false } }, 'image'],
    ['text_color', 'background_color'],
    // ['align_left', 'align_center', 'align_right', 'align_justify'],
    //['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    //['superscript', 'subscript'],
    ['undo', 'redo'],
  ];

  loading: boolean = false;

  getPrivacy(lang: any) {
    this.loading = true;
    this.service.getApi(`sub-admin/get-privacyterms?language=${lang}`).subscribe({
      next: resp => {
        this.about_us = resp.data.about_us;
        this.termsResult = resp.data.termsResult[0].AppTermsofUse;
        this.privacyResult = resp.data.privacyResult[0].YourPrivacy;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  stripHtmlTags(content: string): string {
    return content.replace(/<\/?[^>]+(>|$)/g, "");
  }

  onLanguageChange(event: any): void {
    const selectedId = event.target.value;
    const selectedCategory = this.languages.find((language: { code: any; }) => language.code == selectedId);

    //const selectedCategory = this.categories.find(category => category.id === event.value);

    if (selectedCategory) {
      this.languageId = selectedCategory.code;
      //this.selectedCategoryName = selectedCategory.name;
      console.log('Selected Category ID:', this.languageId);
      this.getPrivacy(this.languageId)
      // console.log('Selected Category Name:', this.selectedCategoryName);
    }
  }

  btnLoader: boolean = false;

  onUpdate() {
    if (/^(<p><\/p>)+$/.test(this.about_us.replace(/\s+/g, ''))) {
      this.toastr.error('Terms and conditions should not be empty.');
      return;
    }

    const formURlData = new URLSearchParams();
    const htmlContentAbout = `${this.about_us}`;
    const htmlContentPri = `${this.privacyResult}`;
    const htmlContentTerm = `${this.termsResult}`;

    // Ensure content is HTML
    formURlData.set('language',
      this.languageId
    );
    formURlData.set('about_us', htmlContentAbout);
    formURlData.set('privacy', htmlContentPri);
    formURlData.set('terms', htmlContentTerm);
    this.btnLoader = true;
    this.service.postAPI('sub-admin/update-privacyterms', formURlData.toString()).subscribe({
      next: (resp) => {
        if (resp.status == 200) {
          this.toastr.success(resp.message);
          this.getPrivacy(this.languageId);
          this.btnLoader = false;
        } else {
          this.toastr.warning(resp.message);
          this.btnLoader = false;
        }
      },
      error: error => {
        this.btnLoader = false;
        this.toastr.warning('Something went wrong.');
        console.log(error.message);
      }
    });
  }


}


