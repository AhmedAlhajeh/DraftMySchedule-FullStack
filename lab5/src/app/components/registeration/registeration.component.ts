import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css']
})
export class RegisterationComponent implements OnInit {
  UserName!: String;
  Email!: String;
  Password!: String;
  Verification!: String;

  URI= "http://localhost:3000/"
  regexCharacters = /^[^<>:/?#@!&;]*$/;
  
  constructor(private http: HttpClient, private route: Router) { }

  visible: boolean = false; 
  //registeration fuctionality
  register(): void {
    var CheckUserName = (<HTMLInputElement>document.getElementById("UserName")).value;
    if(CheckUserName.match(this.regexCharacters)){//input sanitization fot the username
    var UsernameInformation = {
      UserName: this.UserName,
      Email: this.Email,
      Password: this.Password
      
    }
    
    this.http.post<any>(this.URI + 'register', UsernameInformation).subscribe(data => {
      
      if (data.message == 'You have been registered!'){
        alert("You have been registered");
        this.visible = true; //a button will show up to ask the user to verify his/her email

      }else if(data.message == 'The email is already exist!'){
        alert("The email already exists!");
      }
    })

    }
    else{
      alert("Bad UserName Input");
    }
  }
  //verify the email functionality which is making the account active after clciking on verify your email button
  verification(): void {
      var UsernameInformationForVerification = {
      UserName: this.UserName,
      Email: this.Email,
      Password: this.Password,
      Verification: this.Verification
      }
      this.http.put<any>(this.URI + 'verification', UsernameInformationForVerification).subscribe(data => {
        if(data.message == 'Verified'){
          this.route.navigate(['/verified']);
        }
        

      })
  }

  ngOnInit(): void {
  }

}
