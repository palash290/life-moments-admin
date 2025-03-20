import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { MemberProfilesComponent } from './member-profiles/member-profiles.component';
import { RatingReviewComponent } from './rating-review/rating-review.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TimelineComponent } from './timeline/timeline.component';
import { PrivilegesComponent } from './role-management/privileges/privileges.component';
import { MultiplePrivilegesComponent } from './role-management/multiple-privileges/multiple-privileges.component';
import { FamilyMembersComponent } from './member-profiles/family-members/family-members.component';
import { SubAlbumsComponent } from './member-profiles/sub-albums/sub-albums.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { TimelineDateComponent } from './timeline/timeline-date/timeline-date.component';
import { TimelineMonthComponent } from './timeline/timeline-month/timeline-month.component';
import { PhotoAlbumComponent } from './timeline/photo-album/photo-album.component';
import { AlbumComponent } from './member-profiles/album/album.component';
import { SubAdminsComponent } from './sub-admins/sub-admins.component';
import { NgxEditorModule } from 'ngx-editor';
import { PhotoAlbumDateComponent } from './timeline/photo-album-date/photo-album-date.component';
import { PhotoAlbumMonthComponent } from './timeline/photo-album-month/photo-album-month.component';
import { PetListComponent } from './pet/pet-list/pet-list.component';
import { PetTimelineComponent } from './pet/pet-timeline/pet-timeline.component';
import { PetPhotoAlbumYearComponent } from './pet/pet-photo-album-year/pet-photo-album-year.component';
import { PetPhotoAlbumMonthComponent } from './pet/pet-photo-album-month/pet-photo-album-month.component';
import { SubAlbumPhotosComponent } from './member-profiles/sub-album-photos/sub-album-photos.component';
import { FilterPipe } from '../shared/filter.pipe';
import { PetAlbumComponent } from './pet/pet-album/pet-album.component';
import { PetSubAlbumComponent } from './pet/pet-sub-album/pet-sub-album.component';
import { PetSubAlbumPhotosComponent } from './pet/pet-sub-album-photos/pet-sub-album-photos.component';
import { PetPhotoAlbumDateComponent } from './pet/pet-photo-album-date/pet-photo-album-date.component';
import { InterviewComponent } from './interview/interview.component';
import { FaqComponent } from './faq/faq.component';
import { QuestionsComponent } from './interview/questions/questions.component';
import { MemberInterviewComponent } from './member-profiles/member-interview/member-interview.component';
import { MemberQuestionComponent } from './member-profiles/member-question/member-question.component';
import { ManageSubscriptionComponent } from './manage-subscription/manage-subscription.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TreeFamilyComponent } from './member-profiles/tree-family/tree-family.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NotificationContantComponent } from './notification-contant/notification-contant.component';
import { GuestProfilesComponent } from './guest-profiles/guest-profiles.component';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    SideMenuComponent,
    RoleManagementComponent,
    MemberProfilesComponent,
    RatingReviewComponent,
    FeedbackComponent,
    PrivacyComponent,
    TimelineComponent,
    PrivilegesComponent,
    MultiplePrivilegesComponent,
    FamilyMembersComponent,
    SubAlbumsComponent,
    ChangePasswordComponent,
    MyProfileComponent,
    TimelineDateComponent,
    TimelineMonthComponent,
    PhotoAlbumComponent,
    AlbumComponent,
    SubAdminsComponent,
    PhotoAlbumDateComponent,
    PhotoAlbumMonthComponent,
    PetListComponent,
    PetTimelineComponent,
    PetPhotoAlbumYearComponent,
    PetPhotoAlbumMonthComponent,
    SubAlbumPhotosComponent,
    FilterPipe,
    PetAlbumComponent,
    PetSubAlbumComponent,
    PetSubAlbumPhotosComponent,
    PetPhotoAlbumDateComponent,
    InterviewComponent,
    FaqComponent,
    QuestionsComponent,
    MemberInterviewComponent,
    MemberQuestionComponent,
    ManageSubscriptionComponent,
    NotificationsComponent,
    TreeFamilyComponent,
    NotificationContantComponent,
    GuestProfilesComponent

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEditorModule,
    CKEditorModule,
    PickerModule,
    DragDropModule
  ]
})
export class AdminModule { }
