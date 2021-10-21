import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MainComponent } from './main/main.component';
import { AuthguardService } from './services/authguard.service';

const routes: Routes = [

  {path: '', pathMatch: 'full', redirectTo: 'app'},

  {path: 'landing',
  component: LandingPageComponent
  },
  {path: 'app',
  component: MainComponent,
  canActivate: [AuthguardService]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
