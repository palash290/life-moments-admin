import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { SubAdminsComponent } from './sub-admins/sub-admins.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { MemberProfilesComponent } from './member-profiles/member-profiles.component';
import { RatingReviewComponent } from './rating-review/rating-review.component';
import { TimelineComponent } from './timeline/timeline.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { PrivilegesComponent } from './role-management/privileges/privileges.component';
import { MultiplePrivilegesComponent } from './role-management/multiple-privileges/multiple-privileges.component';
import { FamilyMembersComponent } from './member-profiles/family-members/family-members.component';
import { SubAlbumsComponent } from './member-profiles/sub-albums/sub-albums.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { TimelineDateComponent } from './timeline/timeline-date/timeline-date.component';
import { TimelineMonthComponent } from './timeline/timeline-month/timeline-month.component';
import { PhotoAlbumComponent } from './timeline/photo-album/photo-album.component';
import { AlbumComponent } from './member-profiles/album/album.component';

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'sub-admins',
        component: SubAdminsComponent
      },
      {
        path: 'roles-manage',
        component: RoleManagementComponent
      },
      {
        path: 'privileges',
        component: PrivilegesComponent
      },
      {
        path: 'multiple-privileges',
        component: MultiplePrivilegesComponent
      },
      {
        path: 'member-profile',
        component: MemberProfilesComponent
      },
      {
        path: 'family-member',
        component: FamilyMembersComponent
      },
      {
        path: 'albums',
        component: AlbumComponent
      },
      {
        path: 'sub-albums',
        component: SubAlbumsComponent
      },
      {
        path: 'rating',
        component: RatingReviewComponent
      },
      {
        path: 'feedback',
        component: FeedbackComponent
      },
      {
        path: 'privacy',
        component: PrivacyComponent
      },
      {
        path: 'timeline',
        component: TimelineComponent
      },
      {
        path: 'timeline-date',
        component: TimelineDateComponent
      },
      {
        path: 'timeline-month',
        component: TimelineMonthComponent
      },
      {
        path: 'photo-album',
        component: PhotoAlbumComponent
      },
      {
        path: 'my-profile',
        component: MyProfileComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
