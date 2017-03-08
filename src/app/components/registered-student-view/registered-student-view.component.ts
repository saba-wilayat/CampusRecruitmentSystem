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
  templateUrl: './registered-student-view.component.html',
  styleUrls: ['./registered-student-view.component.css']
})
export class RegisteredStudentViewComponent implements OnInit {
  File;
  progress = 0;
  status = "";
  isSuccess = false;
  isCancel = false;
  isError = false;
  isUploading = false;
  isReady = false;
  tempID;
  obj;
  isEDIT = false;
  IsUpdated = false;
  Companies;
  jobs;
  Alljobs;
  groupedID = {};
  message = ""
  savedResume = {}
  lastDialogResult;
  selectedIndex;

  constructor(public af: AngularFire, public dialogService: DialogServiceService, public myservices: GeneralService, public router: RouterModule, public _dialog: MdDialog, @Inject(FirebaseApp) private firebaseApp: firebase.app.App, ActivatedRoute: ActivatedRoute) {


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

    this.af.database.list('/Vecancy', { query: {} })
      .subscribe(Vecancy => {
        //console.log("Vecancy====" , Vecancy)  
        this.Alljobs = Vecancy
      });

    ActivatedRoute.params.subscribe(getKey => {
      this.tempID = getKey;
      this.af.database.object('/Student/Registration/' + this.tempID.id)
        .subscribe(stuObj => {
          this.obj = stuObj;
          //console.log("this.successDetails", this.obj)

        })
    })
    this.af.database.list('/resume/', { query: { orderByChild: 'studentID', equalTo: this.tempID.id } })
      .subscribe(UplodedResume => {
        this.savedResume = {}
        this.savedResume = UplodedResume[0];
        console.log("this.savedResume", this.savedResume)
      });
  }



  ViewJOBS(id) {
    this.af.database.list('/Vecancy/', { query: { orderByChild: 'Company_Id', equalTo: 'id' } })
      .subscribe(Obj => {
        this.jobs = Obj;
        //console.log("this.successDetails", this.jobs)

      })
  }
  EditProfile() {
    this.isEDIT = true;
  }
  UpdateUserProfile(data) {
    this.isEDIT = false;
    var adaNameRef = firebase.database().ref('Student/Registration/' + this.tempID.id);
    data.UserID = this.obj.UserID;
    data.UserType = "Student";
    adaNameRef.set(data)
      .then(function () {
        console.log('Synchronization succeeded');
      })
      .catch(function (error) {
        console.log('Synchronization failed', error);
      });
  }


  FileUpload() {

    // this.af.database.list('/resume/', { query: { orderByChild: 'studentID', equalTo: this.tempID.id } })
    //   .subscribe(resume => {
    //     if (!resume.length) {
    let storageRef = this.firebaseApp.storage().ref();
    let success = false;
    for (let selectedFile of [(<HTMLInputElement>document.getElementById('file')).files[0]]) {
      this.File = selectedFile;
      //this.af.database.list('Student/Registration/' + this.tempID.id).push({ path: '/resume/' + selectedFile.name, filename: selectedFile.name })
      this.af.database.list('/resume').push({ path: '/resume/' + this.tempID.id + "/" + selectedFile.name, filename: selectedFile.name, studentID: this.tempID.id, size: selectedFile.size })
      var uploadTask = storageRef.child('/resume/' + this.tempID.id + '/' + selectedFile.name)
        .put(selectedFile)
        .on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
          console.log('Uploaded a blob or file! Now storing the reference at');
          this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + this.progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              this.status = "Paused";
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              this.status = "Running";
              this.isUploading = true;
              console.log('Upload is running');
              break;
          }
        }, function (error) {
          switch (error.message) {
            case 'storage/unauthorized':
              this.isError = true;
              // User doesn't have permission to access the object
              break;

            case 'storage/canceled':
              this.status = "Canceled";
              this.isCancel = true;
              // User canceled the upload
              break;
            case 'storage/unknown':
              this.isError = true;
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, function () {
          // Upload completed successfully, now we can get the download URL
          console.log('Upload is completed');
          this.status = "Completed";
          this.isSuccess = true;
        });
    }

  }

  FileRemove(filename) {

    let storageRef = this.firebaseApp.storage().ref();

    if (filename) {
      var desertRef = storageRef.child('/resume/' + this.tempID.id + "/" + filename);
    }
    else {
      var desertRef = storageRef.child('/resume/' + this.tempID.id + "/" + this.File.name);
    }
    this.af.database.list('/resume/', { query: { orderByChild: 'studentID', equalTo: this.tempID.id } }).remove()
      .then(
      val => {

        desertRef.delete();
        this.dialogService.OpenDialogBox('File deleted successfully')

      },
      err => {
        console.log(" removedddd");
      });
  }
  viewCompanyJobs(id) {
    this.myservices.setValue(id);
    this.af.database.list('/Vecancy/', { query: { orderByChild: 'Company_Id', equalTo: id } })
      .subscribe(Vecancy => {
        //console.log("Vecancy====" , Vecancy)  
        if (Vecancy && Vecancy.length) {
          let dialogRef = this._dialog.open(JobDialogContent);

          dialogRef.afterClosed().subscribe(result => {
            this.lastDialogResult = result;
          })
        }
        else{
          alert("No Jobs Found")
        }
      });

  }



  dialog(m) {

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
export class JobDialogContent {
  CompanyJobs;
  Companies;
  groupedID = {}
  constructor(public af: AngularFire, @Optional() public dialogRef: MdDialogRef<JobDialogContent>, private _dialog: MdDialog, public myservices: GeneralService) {
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

