import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { JobSeekerComponent } from './features/job-seeker/job-seeker.component';
import { SearchProfileComponent } from './features/search-profile/search-profile.component';
import { ProfileManagementComponent } from './features/profile-management/profile-management.component';
import { UserManagementComponent } from './features/user-management/user-management.component';
import { InterviewQuestionsComponent } from './features/interview-questions/interview-questions.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';
import { HelpCenterComponent } from './pages/help-center/help-center.component';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [MsalGuard],
        children: [
            { path: 'job-seeker', component: JobSeekerComponent },
            { path: 'search-profile', component: SearchProfileComponent },
            { path: 'profile-management', component: ProfileManagementComponent },
            { path: 'user-management', component: UserManagementComponent },
            { path: 'interview-questions', component: InterviewQuestionsComponent },
            { path: 'privacy-policy', component: PrivacyPolicyComponent },
            { path: 'terms-of-service', component: TermsOfServiceComponent },
            { path: 'help-center', component: HelpCenterComponent },
            { path: '', redirectTo: 'job-seeker', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: '' }
];
