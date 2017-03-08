import { Component, OnInit } from '@angular/core';
import {GeneralService} from "../../general.service"

@Component({ 
  templateUrl: './student-view-detail.component.html',
  styleUrls: ['./student-view-detail.component.css']
})
export class StudentViewDetailComponent implements OnInit {
StudentArray;
value;
isStudentData = false;
studentDepartmantWise;
  constructor(public myservices : GeneralService) { }
  qulification = ["BE","BCS","MA"];
 
  onChange(e,Value) {    
      console.log("Value" , Value); 
      this.value = Value     
      this.myservices.getStudentsDataFromFB();
      this.myservices.getStudentsSubject()
    .subscribe(c => {
      this.StudentArray  = c.students;
      this.isStudentData = true;
      console.log("cccc" , c)
      console.log("StudentArray" , this.StudentArray)
      if(this.StudentArray.length){
        this.StudentArray.forEach(function(s){          
          if(s.Department == c.value){
            this.studentDepartmantWise = s
          }
          
        })
      }
    })
  }
   ngOnInit() {
  }
}
