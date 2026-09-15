import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoginComponent } from './modules/user/login.component';
import { RegisterComponent } from './modules/user/register.component';
import { MfaSetupComponent } from './modules/user/mfa-setup.component';
import { MfaVerifyComponent } from './modules/user/mfa-verify.component';
import { MainLayoutComponent } from './modules/layouts/main_layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },

      // MFA routes
      { path: 'mfa/setup', component: MfaSetupComponent },
      { path: 'mfa/verify', component: MfaVerifyComponent },

      // Private routes with guard
      {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          { path: 'dashboard', component: DashboardComponent },
        ]
      },

      { path: '**', redirectTo: 'login' }
    ])
  ]
});