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
        path: 'member-profile',
        component: MemberProfilesComponent
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
