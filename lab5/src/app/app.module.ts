import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { CreatingComponent } from './components/creating/creating.component';
import { ManagingComponent } from './components/managing/managing.component';
import { LoginComponent } from './components/login/login.component';
import { BrowsingComponent } from './components/browsing/browsing.component';
import { AuthenticatedNavbarComponent } from './components/authenticated-navbar/authenticated-navbar.component';
import { VerifiedComponent } from './components/verified/verified.component';
import { AdminComponent } from './components/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CreatingComponent,
    ManagingComponent,
    routingComponents,
    LoginComponent,
    BrowsingComponent,
    AuthenticatedNavbarComponent,
    VerifiedComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
