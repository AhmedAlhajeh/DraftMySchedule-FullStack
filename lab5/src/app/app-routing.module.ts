import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreatingComponent } from './components/creating/creating.component';
import { ManagingComponent } from './components/managing/managing.component';
import { LoginComponent} from './components/login/login.component';
import { RegisterationComponent} from './components/registeration/registeration.component';
import { BrowsingComponent} from './components/browsing/browsing.component';
import { VerifiedComponent} from './components/verified/verified.component';
import { AdminComponent} from './components/admin/admin.component';
import { ProtectingGuard } from './protecting.guard';
import { SettingComponent} from './components/setting/setting.component'


const routes: Routes = [ 
{path: 'Home', component: HomeComponent},
{path: 'creating', component: CreatingComponent, canActivate:[ProtectingGuard]},
{path: 'managing', component: ManagingComponent, canActivate:[ProtectingGuard]},
{path: 'browsing', component: BrowsingComponent},
{path: 'registeration', component: RegisterationComponent},
{path: 'verified', component: VerifiedComponent},
{path: 'admin', component: AdminComponent},
{path: 'setting', component: SettingComponent},
{path: '', redirectTo: 'Home', pathMatch: 'full'}//making sure the first page shows up when I load my website is the home page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [HomeComponent, CreatingComponent, ManagingComponent, LoginComponent, RegisterationComponent, AdminComponent, VerifiedComponent]
