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
import { PhotoAlbumDateComponent } from './timeline/photo-album-date/photo-album-date.component';
import { PhotoAlbumMonthComponent } from './timeline/photo-album-month/photo-album-month.component';
import { PetListComponent } from './pet/pet-list/pet-list.component';
import { PetTimelineComponent } from './pet/pet-timeline/pet-timeline.component';
import { PetPhotoAlbumYearComponent } from './pet/pet-photo-album-year/pet-photo-album-year.component';
import { PetPhotoAlbumMonthComponent } from './pet/pet-photo-album-month/pet-photo-album-month.component';
import { SubAlbumPhotosComponent } from './member-profiles/sub-album-photos/sub-album-photos.component';
import { PetAlbumComponent } from './pet/pet-album/pet-album.component';
import { PetSubAlbumComponent } from './pet/pet-sub-album/pet-sub-album.component';
import { PetSubAlbumPhotosComponent } from './pet/pet-sub-album-photos/pet-sub-album-photos.component';
import { PetPhotoAlbumDateComponent } from './pet/pet-photo-album-date/pet-photo-album-date.component';

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
        path: 'privileges/:name',
        component: PrivilegesComponent
      },
      {
        path: 'multiple-privileges/:length',
        component: MultiplePrivilegesComponent
      },
      {
        path: 'member-profile',
        component: MemberProfilesComponent
      },
      {
        path: 'family-member/:parentId/:email',
        component: FamilyMembersComponent
      },
      {
        path: 'albums/:memberId',
        component: AlbumComponent
      },
      {
        path: 'sub-albums/:albumId/:userId',
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
        path: 'timeline/:id',
        component: TimelineComponent
      },
      {
        path: 'timeline-date/:year/:month',
        component: TimelineDateComponent
      },
      {
        path: 'timeline-month/:year',
        component: TimelineMonthComponent
      },
      {
        path: 'photo-album/:date/:userId',
        component: PhotoAlbumComponent
      },
      {
        path: 'photo-album-month/:year/:month/:userId',
        component: PhotoAlbumMonthComponent
      },
      {
        path: 'photo-album-date/:userId/:date',
        component: PhotoAlbumDateComponent
      },


      {
        path: 'my-profile',
        component: MyProfileComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'pet/:ownerId',
        component: PetListComponent
      },
      {
        path: 'pet-timeline/:id/:ownerId',
        component: PetTimelineComponent
      },

      {
        path: 'pet-photo-album-year/:date/:userId',
        component: PetPhotoAlbumYearComponent
      },
      {
        path: 'pet-photo-album-month/:year/:month/:userId',
        component: PetPhotoAlbumMonthComponent
      },

      {
        path: 'pet-photo-album-date/:userId/:date',
        component: PetPhotoAlbumDateComponent
      },

      {
        path: 'sub-album-photos',
        component: SubAlbumPhotosComponent
      },

      {
        path: 'pet-albums/:petId',
        component: PetAlbumComponent
      },
      {
        path: 'pet-sub-albums/:albumId/:petId',
        component: PetSubAlbumComponent
      },
      {
        path: 'pet-sub-album-photos',
        component: PetSubAlbumPhotosComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
