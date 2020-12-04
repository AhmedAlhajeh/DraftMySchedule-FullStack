import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-managing',
  templateUrl: './managing.component.html',
  styleUrls: ['./managing.component.css']
})
export class ManagingComponent implements OnInit {
  courses2: any[]; //We use this so we can access it in html file to display time table
  constructor(private http: HttpClient, private route: Router) { this.courses2 = []}
  URI = 'http://localhost:3000';
  visible: boolean = false; 
  
  //delete all schedules functionality
  DeleteSchedules(): void {
    this.http.delete<any>(this.URI + '/api/schedules/all').subscribe(data => {
      if(data.message == "All schedules have been deleted successfully "){
        alert("All schedules have been deleted successfully");
        location.reload();
        
      }
    })
  }
  //display a specific schedule with its courses functionality
  displaySchedule(): void {
    var ResultBox2 = document.getElementById("resultbox2");
    //ResultBox2.innerHTML = "";
    var DisplaySchedule = (<HTMLInputElement>document.getElementById('ScheduleName')).value;
    this.http.get<any>(this.URI + '/api/schedules/ShowCourses?name='+ DisplaySchedule).subscribe((data: any) => {
      this.courses2 = [];//Making the courses that have subject and catalog_nbr as an array to add the ramining infi in it
      for (let i =0; i<data.length; i++){
        this.http.get<any>(this.URI + '/api/courses/search/'+ data[i].subject + "/" + data[i].catalog_nbr).subscribe((timetabledata: any) => {
          this.courses2.push(timetabledata); //getting the information for the courses that are in the the specific shcedule and push the remaining info in it
           
        })
      }

    });
    

  }
  tryToDelete(): void {
    this.visible = true;
  }

  decline(): void {
    this.visible = false;
  }
  //deleting a specific schedule functionality
  deleteASchedule(): void {
    var ASchedule = (<HTMLInputElement>document.getElementById('ScheduleName')).value;
    this.http.delete<any>(this.URI + '/api/schedules?name='+ASchedule).subscribe(data => {
      if(data.message == "The selected schedule has been deleted"){
        alert("The selected schedule has been deleted");
        location.reload();

      }
    });
  }

  //public the schedule for the browser
  publicSchedule(): void {
    
    var value1 = (<HTMLInputElement>document.getElementById('ScheduleName')).value;
    var SchedulePublic =  {
      ScheduleName: value1
    }
    this.http.put<any>(this.URI + '/public' , SchedulePublic).subscribe(data => {
      if(data.message == 'Public' ){
        alert("The selected schedule is now public ");
      }
    })

  }
  //private the schedule for the browser
  privateSchedule(): void {
    var value2 = (<HTMLInputElement>document.getElementById('ScheduleName')).value;
    var SchedulePrivate =  {
      ScheduleName: value2
    }
    this.http.put<any>(this.URI + '/private' , SchedulePrivate).subscribe(data => {
      if(data.message == 'Private' ){
        alert("The selected schedule is now private ");
      }
    })

  }

  //Automatically makes the drop menu for schedules names work
  ngOnInit(): void {
    if(localStorage.Token == "" || localStorage.Token == undefined){
      this.route.navigate(['/Home']);
    }
    

    this.http.get<any>(this.URI + '/api/schedules/schedulesList?ScheduleToken=' + localStorage.Token).subscribe(data => {
      
      const ScheduleDropDown = document.getElementById('ScheduleName');
      for (let i=0; i <data.length; i++) {
        var ScheduleOption = document.createElement("option");
        var ScheduleText = document.createTextNode(data[i]);
        ScheduleOption.appendChild(ScheduleText);
        ScheduleDropDown?.appendChild(ScheduleOption);
    }
    });

    
  }

}