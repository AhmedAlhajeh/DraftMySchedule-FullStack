import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-creating',
  templateUrl: './creating.component.html',
  styleUrls: ['./creating.component.css']
})
export class CreatingComponent implements OnInit {
  courses: any[];
  regexCharacters = /^[^<>:/?#@!&;]*$/;
  constructor(private http: HttpClient) {this.courses = []; }
  
  URI = 'http://localhost:3000';
   //We use this so we can access it in html file to display time table
  
//create a schedule functionality
 createASchedule(): void {
   var SCHEDULENAME = (<HTMLInputElement>document.getElementById('ScheduleName')).value;
   var SCHEDULEDESCRIPTION = (<HTMLInputElement>document.getElementById('ScheduleDescription')).value;
   if(SCHEDULENAME.match(this.regexCharacters)){ //input sanitization we add a schedule name
    var ScheduleToken = {
      Token: localStorage.Token
    }
     
    if(SCHEDULEDESCRIPTION == ""){
      //connect it to the back end by adding a schedule name
   this.http.post<any>(this.URI + '/api/schedules/createschedule?name='+SCHEDULENAME + '&ScheduleToken=' + ScheduleToken.Token, ScheduleToken).subscribe(data =>{
    alert(data.message);
    location.reload();
     
    })

    }
    else{
      //connect it to the back end by adding a schedule name
   this.http.post<any>(this.URI + '/api/schedules/createschedule?name='+SCHEDULENAME + '&description=' + SCHEDULEDESCRIPTION + '&ScheduleToken=' + ScheduleToken.Token, ScheduleToken).subscribe(data =>{
    alert("The schedule with the name you entered has been created");
    location.reload();
     
  })
    } 
   
  }
  else{
    alert("Bad Input");
  }
 }
 //Add courses functionality in a specific schedule
 addToSchedule(subject:String, CourseNumber:String): void { //creating parametes to add the specific course subject in that course
  var addCourse = (<HTMLInputElement>document.getElementById('ScheduleName2')).value;
  this.http.put<any>(this.URI + '/api/schedules/updating?scheduleName='+addCourse + "&subject=" + subject + "&CourseNumber="+ CourseNumber, "").subscribe(data =>{
    alert("The course that you entered has been added to your schedule");
     
  })
}
 
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
  this.http.get<any>("http://localhost:3000"+ url).subscribe((data: any) =>{
    if(data.length == undefined){ //if we are trying to search all subjects and courses at the same time
      alert(data.message);
      return;
    }
    
    this.courses = data; //we put data in the array we created above
    
     
     
    //we cannot search by component only
    if(data.message == "Do not search by component only."){
      const ComponentText = document.createTextNode("You can't choose a course component only. You have to Choose a subject as well");
      ResultBox?.appendChild(ComponentText);

    }
   })
      
      
      
      
    }
    
    
  
   //Automatically makes the drop down menu for searching subjects work
  ngOnInit()  {
    this.http.get<any>(this.URI + '/api/courses').subscribe(data => {
      const SubjectDropDown = document.getElementById('Subject');
      for (let i=0; i <data.SubjectArray.length; i++) {
        var SubjectOption = document.createElement("option");
        var SubjectText = document.createTextNode(data.SubjectArray[i]);
        SubjectOption.appendChild(SubjectText);
        SubjectDropDown?.appendChild(SubjectOption);
    }
    });
    //Automatically makes the drop menu for schedules names work
    this.http.get<any>(this.URI + '/api/schedules/schedulesList?ScheduleToken=' + localStorage.Token ).subscribe(data => {
      
      const ScheduleDropDown = document.getElementById('ScheduleName2');
      for (let i=0; i <data.length; i++) {
        var ScheduleOption = document.createElement("option");
        var ScheduleText = document.createTextNode(data[i]);
        ScheduleOption.appendChild(ScheduleText);
        ScheduleDropDown?.appendChild(ScheduleOption);
    }
    });
  }

}
