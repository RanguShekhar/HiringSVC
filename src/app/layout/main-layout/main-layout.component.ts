import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MsalService } from '@azure/msal-angular';
import { Toolbar } from '../toolbar/toolbar';
import { Sidebar } from '../sidebar/sidebar';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../core/services/loader.service';
import { SessionStorageService } from '../../core/services/session-storage.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    Toolbar,
    Sidebar,
    LoaderComponent
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent {
  userName = 'User';
  userEmail = 'user@example.com';
  isExpanded = true;
  currentYear: number = new Date().getFullYear();
  isEmployer = false;
  isJobSeeker = false;
  isAdmin = false;

  constructor(
    private authService: MsalService,
    private router: Router,
    private loaderService: LoaderService,
    private session: SessionStorageService
  ) {
    const account = this.authService.instance.getActiveAccount() || this.authService.instance.getAllAccounts()[0];
    if (account) {
      this.userName = account.name || 'User';
      this.userEmail = account.username;
      this.session.setItem('userName', this.userName);
      this.session.setItem('email', this.userEmail);
    }

    debugger;
    const claims = this.authService.instance.getActiveAccount()?.idTokenClaims as any || this.authService.instance.getAllAccounts()[0]?.idTokenClaims as any;
    const groups =  claims?.groups || [];
    this.session.setItem('isEmployer', false);
    this.session.setItem('isAdmin', false);
    if(groups.includes('f566336a-4f00-41f5-a07e-51b1074c33e5'))
    {
      this.isJobSeeker = true;
      this.router.navigate(['/main']);
    }
    else if(groups.includes('1f6074a2-6056-4799-8df7-1d199898ce2e'))
    {
      this.isEmployer = true;
      this.session.setItem('isEmployer', true);
      this.router.navigate(['/search']);
    }
    else if(groups.includes('28b1ee9c-5d91-49eb-b245-65909598c58a'))
    {
      this.isAdmin = true;
      this.session.setItem('isAdmin', true);
      this.router.navigate(['/search']);
    }
    else{
      this.router.navigate(['/unauthorized']);
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loaderService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loaderService.hide();
      }
    });
  }

  logout() {
    this.session.clear();
    this.authService.logoutRedirect();
  }
}
