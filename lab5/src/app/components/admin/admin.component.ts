import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private http: HttpClient) { }
  URI = 'http://localhost:3000';




  deactivateUsers(): void {
    var Deactivating = (<HTMLInputElement>document.getElementById('UserName')).value; 
    var DeactivatingEmail = {
    Email: Deactivating
    
    }
    this.http.put<any>(this.URI + '/deactivation', DeactivatingEmail).subscribe(data => {
      if(data.message == 'Deactivated'){
        alert("The account " + Deactivating + " has been deactivated successfuly ");
      }
      

    })
}

reactivateUsers(): void {
  var Reactivating = (<HTMLInputElement>document.getElementById('UserName')).value; 
  var ReactivatingEmail = {
  Email: Reactivating
  
  }
  this.http.put<any>(this.URI + '/reactivation', ReactivatingEmail).subscribe(data => {
    if(data.message == 'Reactivated'){
      alert("The account " + Reactivating + " has been reactivated successfuly ");
    }
    

  })
}








  ngOnInit(): void {

    this.http.get<any>(this.URI + '/usersList').subscribe(data => {
      
      const UserDropDown = document.getElementById('UserName');
      for (let i=0; i <data.length; i++) {
        var UserOption = document.createElement("option");
        var UserText = document.createTextNode(data[i].Email);
        UserOption.appendChild(UserText);
        UserDropDown?.appendChild(UserOption);
    }
    });


  }

}
