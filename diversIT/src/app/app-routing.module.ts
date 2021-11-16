import { ForumComponent } from './forum/forum.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MainComponent } from './main/main.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { AdminguardService } from './services/adminguard.service';
import { AuthguardService } from './services/authguard.service';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: 'app' },

  {
    path: 'landing',
    component: LandingPageComponent
  },
  {
    path: 'forum',
    component: ForumComponent
  },
  {
    path: 'app',
    component: MainComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [AuthguardService, AdminguardService]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'profile/:id',
    component: ProfilePageComponent,
    canActivate: [AuthguardService]
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
