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
import { FormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { TimelineDateComponent } from './timeline/timeline-date/timeline-date.component';
import { TimelineMonthComponent } from './timeline/timeline-month/timeline-month.component';
import { PhotoAlbumComponent } from './timeline/photo-album/photo-album.component';
import { AlbumComponent } from './member-profiles/album/album.component';


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
    AlbumComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
  ]
})
export class AdminModule { }
