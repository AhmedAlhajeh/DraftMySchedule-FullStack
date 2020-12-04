import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authenticated-navbar',
  templateUrl: './authenticated-navbar.component.html',
  styleUrls: ['./authenticated-navbar.component.css']
})
export class AuthenticatedNavbarComponent implements OnInit {

  constructor() { }

  logout(): void{
    localStorage.Token = "";
  }

  ngOnInit(): void {
  }

}
