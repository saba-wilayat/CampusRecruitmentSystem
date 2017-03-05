import { Component, OnInit, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods, FirebaseApp } from 'angularfire2';
import { firebaseLoginPolicy } from '../../app.module';
import { GeneralService } from "../../general.service"
import { RouterModule, Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  admin: FirebaseListObservable<any>;
  StudentArray;
  value;
  isStudentData = false;
  studentDepartmantWise = [];
  loading = false;
  RemoveMode = false;
  eamialIds = [];
  emailObj = {};
  lastDialogResult;
  Vecancy: FirebaseListObservable<any>;
  tempID;
  obj = {};
  resume;
  selectedValue;
groupedID = {};
Companies;


  constructor(public af: AngularFire, public myservices: GeneralService, public router: Router, @Inject(FirebaseApp) private firebaseApp: firebase.app.App) {
    this.admin = af.database.list('/Admin/Registration');
    this.myservices.getStudentsDataFromFB();
    this.myservices.getStudentsSubject()
      .subscribe(c => {
        this.StudentArray = c.students;
        console.log("this.StudentArray", this.StudentArray)
      })

      this.af.database.list('/Company/Registration', { query: { orderByChild: 'UserType', equalTo: 'Company' } })
      .subscribe(Companies => {
        //console.log("Companies====" , Companies)  
        this.Companies = Companies;
        for (var i = 0; i < this.Companies.length; i++) {
          if (this.Companies[i].$key) {
            this.groupedID[this.Companies[i].$key] = this.groupedID[this.Companies[i].$key] || {};
            this.groupedID[this.Companies[i].$key] = this.Companies[i].CompanyName;
          }
        }
      });
  }


  changeDepartment(e, Value) {
    this.loading = true;
    this.value = Value;
    this.studentDepartmantWise = [];
    this.loading = false;
    this.isStudentData = true;
    if (this.StudentArray && this.StudentArray.length) {
      var flag = false;
      console.log("this.StudentArray", this.StudentArray)
      for (var i = 0; i < this.StudentArray.length; i++) {
        if (this.StudentArray[i].Department) {
          if (this.StudentArray[i].Department == this.value) {
            this.studentDepartmantWise.push(this.StudentArray[i])
            flag = true;
            break;
          }
        }
      }
    }
  }


  ViewResume(id) {    
    this.af.database.list('/resume/', { query: { orderByChild: 'studentID', equalTo: id } })
      .subscribe(resume => {
        if (resume && resume.length) {          
          this.resume = resume;
          let storageRef = this.firebaseApp.storage().ref();
          var starsRef = storageRef.child('/resume/' + id + "/" + this.resume[0].filename);

          // Get the download URL
          starsRef.getDownloadURL().then(function (url) {
            // Insert url into an <img> tag to "download"
            //console.log("url" , url)        
            location.href = url;
          }).catch(function (error) {
            console.log("error", error)
            switch (error.message) {
              case 'storage/object_not_found':
                // File doesn't exist
                break;

              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;

              case 'storage/canceled':
                // User canceled the upload
                break;


              case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                break;
            }
          });
        }
        else{
          alert("No Resume Found")
        }
      })
  }

deleteUser(id) {    
    let storageRef = this.firebaseApp.storage().ref(); 
    this.af.database.list('/Student/Registration', { query: { orderByChild: 'UserID', equalTo: id } }).remove()    
      .then(
      val => {         
         alert('User deleted successfully');
      },
      err => {
        console.log(" removedddd");
      }); 
  }
  ngOnInit() {
  }

}
