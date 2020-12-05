import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  courses: any[];
  constructor(private http: HttpClient) {this.courses = [] }
  URI = 'http://localhost:3000';
  

   //search for course functionality
   courseSearch(): void {
    var ResultBox = document.getElementById("resultbox");
    //ResultBox.innerHTML = "";
    //ResultBox.setAttribute("class"," message");
    var subject = (<HTMLInputElement>document.getElementById('Subject')).value;
    var CourseNum = (<HTMLInputElement>document.getElementById('CourseNumber')).value;
    var component = (<HTMLInputElement>document.getElementById('Component')).value;
    var url = '/api/courses/submit?' + "Subject=" + subject + "&CourseNumber=" + CourseNum + "&Component=" + component;
    
    //connect it to the back end and get the info form json file
    this.http.get<any>("http://localhost:3000"+ url).subscribe(data =>{
      if(data.length == undefined){ //if we are trying to search all subjects and courses at the same time
        alert(data.message);
        return;
      }
      this.courses = data; //we put data in the array we created above

       //we cannot search by course number only
       if(data.message == "Do not search by course number only."){
        const CourseNumberText = document.createTextNode("You can't choose a course number only. You have to Choose a subject as well");
        ResultBox?.appendChild(CourseNumberText);

      }
      //we cannot search by component only
      else if(data.message == "Do not search by component only."){
        const ComponentText = document.createTextNode("You can't choose a course component only. You have to Choose a subject as well");
        ResultBox?.appendChild(ComponentText);

      }
    })
    
    
    
    
  }
  
  //Automatically makes the drop down menu for searching subjects work
  ngOnInit(): void {
    this.http.get<any>(this.URI + '/api/courses').subscribe(data => {
      
      const SubjectDropDown = document.getElementById('Subject');
      for (let i=0; i <data.SubjectArray.length; i++) {
        var SubjectOption = document.createElement("option");
        var SubjectText = document.createTextNode(data.SubjectArray[i]);
        SubjectOption.appendChild(SubjectText);
        SubjectDropDown?.appendChild(SubjectOption);
    }
    });
  }

}
