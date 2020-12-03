import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Email!: String;
  Password!: String;
  Verification!: String;
  URI= "http://localhost:3000/"
  constructor(private http: HttpClient, private route: Router) { }
  visible: boolean = false;

  logIn(): void {
    var AccountInformation = {
      Email: this.Email,
      Password: this.Password
      
    }
    this.http.post<any>(this.URI + 'login', AccountInformation).subscribe(data => {
      console.log(data);
      if (data.message == 'You should put your email and password'){
        alert("You should put both your email and password");
        

      }else if(data.message == 'Please put a valid email'){
        alert("Please put a valid email");
      }
      else if(data.message ==  'Administrator'){
        this.route.navigate(['/admin']);
      }
      else if(data.message ==  'Cannot login'){
        alert("Cannot login");
      }
      else if(data.message == 'Email Not Found'){
        alert("Email Not Found");
      }
      else if(data.message == 'Account Inactive, Contact Administrator'){
        alert("Account Inactive, Contact Administrator");
        this.visible = true;
      }
      else if(data.message == 'Wrong Password'){
        alert("Wrong Password");
      }
      else if(data.message == 'Unable to login'){
        alert("Unable to login");
      }
      else if(data.message == 'You have been successfully logged in'){
        alert("You have been successfully logged in");
        localStorage.Token = data.AccessingToken;
        this.route.navigate(['/creating']);
      }
      else if(data.message == 'You cannot login. Your account is deactivated'){
        alert("The Account is disabled. please contact the admin by sending an email to AhmedAlhajeh@uwo.ca");
      }
    })

  }


  verification(): void {
    var UsernameInformationForVerification = {
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
