import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css']
})
export class RegisterationComponent implements OnInit {
  UserName!: String;
  Email!: String;
  Password!: String;
  URI= "http://localhost:3000/"

  constructor(private http: HttpClient) { }

  register(): void {
    var UsernameInformation = {
      UserName: this.UserName,
      Email: this.Email,
      Password: this.Password
    }
    this.http.post<any>(this.URI + 'register', UsernameInformation).subscribe(data => {
      if (data.message == 'You have been registered!'){
        alert("You have been registered");
        let registeration = document.getElementById("Register");
        registeration?.setAttribute("id", "Register");
        let verified = document.createElement("button");
        let link = document.createTextNode("Verify Your Email");
        document.body.insertBefore(verified, document.getElementById("Register"));
        registeration?.appendChild(verified);
        verified.appendChild(link);
      }
       
    })
    


  }



  ngOnInit(): void {
  }

}
