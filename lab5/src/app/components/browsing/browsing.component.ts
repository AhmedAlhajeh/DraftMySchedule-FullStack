import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-browsing',
  templateUrl: './browsing.component.html',
  styleUrls: ['./browsing.component.css']
})
export class BrowsingComponent implements OnInit {

  courses: any[];
  constructor(private http: HttpClient) {this.courses = [] }
  URI = 'http://localhost:3000';
  

   //search for course functionality
   courseSearch(): void {
    var ResultBox = document.getElementById("resultbox");
    var subject = (<HTMLInputElement>document.getElementById('Subject')).value;
    var CourseNum = (<HTMLInputElement>document.getElementById('CourseNumber')).value;
    var component = (<HTMLInputElement>document.getElementById('Component')).value;
    var url = '/api/courses/submit?' + "Subject=" + subject + "&CourseNumber=" + CourseNum + "&Component=" + component;
    
    //connect it to the back end and get the info form json file
    this.http.get<any>( this.URI + url).subscribe(data =>{
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

  keywordSearch(): void {
    var keyword2 = (<HTMLInputElement>document.getElementById('Keywords')).value;
    var url2 = '/keywords?keyword=' + keyword2;
    if(keyword2.length == undefined || keyword2.length < 4){ //if we are trying to search all subjects and courses at the same time
      alert("You cannot search by keywords with less than 4 characters");
      return;
    }
    this.http.get<any>(this.URI + url2).subscribe(data => {
       
      this.courses = data; //we put data in the array we created above
    })
  }

  showDetail(subject: String, catalog_nbr: String){
     this.http.get<any>(this.URI + '/api/courses/search/'+ subject + "/" + catalog_nbr).subscribe(data => {
      let DetailString = "";       //Alert string to be displayed
      DetailString += data.subject + " " + data.catalog_nbr + "\r\n";
      DetailString += data.catalog_description + "\r\n\r\n";
       
      DetailString += data.course_info[0].enrl_stat + "\r\n";
      DetailString += data.course_info[0].class_nbr + "\r\n";
      DetailString += data.course_info[0].facility_ID + "\r\n";
      DetailString += data.course_info[0].campus + "\r\n";
      DetailString += data.course_info[0].instructors + "\r\n";
      DetailString += data.course_info[0].descr + "\r\n";
      DetailString += "\r\n";
      
      alert(DetailString); 
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
