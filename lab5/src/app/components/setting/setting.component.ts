import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  constructor(private http: HttpClient, private route: Router) { }
  URI = 'http://localhost:3000';

  updatePassword(): void{
    var UserPassword = (<HTMLInputElement>document.getElementById('UpdatePassword')).value;
    this.http.put<any>(this.URI + '/updatepassword', {ScheduleToken: localStorage.Token, Password: UserPassword }).subscribe(data =>{
      if(data.message = 'You Password has been updated'){
        alert("Your Password has been updated");
      }
    })
  }

  ngOnInit(): void {
    if(localStorage.Token == "" || localStorage.Token == undefined){
      this.route.navigate(['/Home']);
    }
  }

}
