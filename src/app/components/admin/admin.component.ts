import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods, FirebaseApp } from "angularfire2"
import { firebaseLoginPolicy } from '../../app.module';
import { GeneralService } from "../../general.service";
import { DialogServiceService } from "../../dialog-service.service";
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AngularFireModule } from "angularfire2";
import * as firebase from 'firebase';
import { MdDialog, MdDialogRef } from '@angular/material';

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
  jobs;

  constructor(public af: AngularFire, public myservices: GeneralService, public router: Router,public _dialog: MdDialog, @Inject(FirebaseApp) private firebaseApp: firebase.app.App) {
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
           // break;
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
        else {
          alert("No Resume Found")
        }
      })
  }
  ViewJOBS(id) {
    this.af.database.list('/Vecancy/', { query: { orderByChild: 'Company_Id', equalTo: 'id' } })
      .subscribe(Obj => {
        if (Obj && Obj.length) {
          this.jobs = Obj;
          //console.log("this.successDetails", this.jobs)
        }
        else{
          alert("No Job Found")
        }


      })
  }

  viewCompanyJobs(id) {
    this.myservices.setValue(id);
    this.af.database.list('/Vecancy/', { query: { orderByChild: 'Company_Id', equalTo: id } })
      .subscribe(Vecancy => {
        //console.log("Vecancy====" , Vecancy)  
        if (Vecancy && Vecancy.length) {
          let dialogRef = this._dialog.open(AdminJobDialogContent);

          dialogRef.afterClosed().subscribe(result => {
            this.lastDialogResult = result;
          })
        }
        else{
          alert("No Jobs Found")
        }
      });

  }

  deletCompany(id) {
    let storageRef = this.firebaseApp.storage().ref();
    this.af.database.list('/Company/Registration', { query: { orderByChild: 'UserID', equalTo: id } }).remove()
      .then(
      val => {
        for(var c =0 ; c < this.Companies.length ; c++){
          if(this.Companies[c].s.$key == id){
              this.Companies.splice(1,c);
              console.log(" this.Companies" , this.Companies);
          }
        }
        alert('company deleted successfully');
      },
      err => {
        console.log(" removedddd");
      });
  }
  deleteUser(id) {
    let storageRef = this.firebaseApp.storage().ref();
    this.af.database.list('/Student/Registration', { query: { orderByChild: 'UserID', equalTo: id } }).remove()
      .then(
      val => {
        for(var c =0 ; c < this.studentDepartmantWise.length ; c++){
          if(this.studentDepartmantWise[c].s.$key == id){
              this.studentDepartmantWise.splice(1,c);             
          }
        }
        alert('User deleted successfully');
      },
      err => {
        console.log(" removedddd");
      });
  }
  ngOnInit() {
  }

}


@Component({
  template: `
  <div id="CompaniesCardDiv">
        <md-card *ngFor="let s of this.CompanyJobs" id="CompaniesCard">
            <div class="UserProfile">
                <h2>
                    <span class="uname-css">
                        {{(s.jobTitle ? s.jobTitle :  "")}}
                    </span>
                </h2>
                <div>
                    <p class="info-user bold" style="width: auto;"> <span class="infoLbl bold">Eligibility Criteria:</span> <span class="relation-css regular rightFloatElem">{{s.EligibilityCriteria || ""}}</span></p>
                </div>
                <div>
                    <p class="info-user bold" style="width: auto;"> <span class="infoLbl bold">Comapny Name:</span> <span class="relation-css regular rightFloatElem">{{this.groupedID[s.Company_Id] || ""}}</span></p>
                </div>
                <div>
                    <p class="info-user bold" style="width: auto;"> <span class="infoLbl bold">Email:</span> <span class="relation-css regular rightFloatElem">{{s.Email || ""}}</span></p>
                </div>
                <div>
                    <p class="info-user bold" style="width: auto;"> <span class="infoLbl bold">Job Profile:</span> <span class="relation-css regular rightFloatElem">{{s.JobProfile || ""}}</span></p>
                </div>
                <div>
                    <p class="info-user bold" style="width: auto;"> <span class="infoLbl bold">Salary:</span> <span class="relation-css regular rightFloatElem">{{s.Salary || ""}}</span></p>
                </div>
            </div>
        </md-card><br>
    </div>
  `,
  styles: [`
    #CompaniesCardDiv{
    min-width: 45em !important;
    height: 30em !important;
    }
  `],
})
export class AdminJobDialogContent {
  CompanyJobs;
  Companies;
  groupedID = {}
  constructor(public af: AngularFire, @Optional() public dialogRef: MdDialogRef<AdminJobDialogContent>, private _dialog: MdDialog, public myservices: GeneralService) {
    var ID = this.myservices.getCompnayID();
    console.log(ID)
    this.af.database.list('/Vecancy/', { query: { orderByChild: 'Company_Id', equalTo: ID } })
      .subscribe(Vecancy => {
        //console.log("Vecancy====" , Vecancy)  
        this.CompanyJobs = Vecancy
      });

    this.af.database.list('/Company/Registration', { query: { orderByChild: 'UserType', equalTo: 'Company' } })
      .subscribe(Companies => {
        console.log("Companies====", Companies)
        this.Companies = Companies;
        for (var i = 0; i < this.Companies.length; i++) {
          if (this.Companies[i].$key) {
            this.groupedID[this.Companies[i].$key] = this.groupedID[this.Companies[i].$key] || {};
            this.groupedID[this.Companies[i].$key] = this.Companies[i].CompanyName;
          }
        }
      });

  }

}
