import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authenticated-navbar',
  templateUrl: './authenticated-navbar.component.html',
  styleUrls: ['./authenticated-navbar.component.css']
})
export class AuthenticatedNavbarComponent implements OnInit {

  constructor() { }
  //by pressing home on hte navbar the user will log out and go to the home page
  logout(): void{
    localStorage.Token = "";
  }

  ngOnInit(): void {
  }

}
