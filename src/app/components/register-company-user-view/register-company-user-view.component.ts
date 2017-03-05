import { Component, OnInit, Injectable, Optional, Inject } from '@angular/core';
import { GeneralService } from "../../general.service"
import { Http, Response } from '@angular/http';
import { MdDialog, MdDialogRef } from '@angular/material';
import { firebaseLoginPolicy } from '../../app.module';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods, FirebaseApp } from 'angularfire2';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AngularFireModule } from "angularfire2";
import * as firebase from 'firebase';

@Component({
  templateUrl: './register-company-user-view.component.html',
  styleUrls: ['./register-company-user-view.component.css'],

})
export class RegisterCompanyUserViewComponent implements OnInit {
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

  constructor(public af: AngularFire, public myservices: GeneralService, private http: Http, private _dialog: MdDialog, ActivatedRoute: ActivatedRoute, @Inject(FirebaseApp) private firebaseApp: firebase.app.App) {

    ActivatedRoute.params.subscribe(getKey => {
      console.log("getKey", getKey)
      this.tempID = getKey;
      this.Vecancy = af.database.list('/Vecancy');


      this.myservices.getStudentsDataFromFB();
      this.myservices.getStudentsSubject()
        .subscribe(c => {
          this.StudentArray = c.students;
          console.log("this.StudentArray", this.StudentArray)
        })
    })
  }


  selectToggle(evt, s) {
    console.log(s)
    s.selected = !s.selected;
    if (s.selected && s.Email) {
      this.eamialIds.push(s.Email)
    }
    else {
      this.eamialIds.splice((this.eamialIds.indexOf(s.Email)), 1)
    }
    console.log(this.eamialIds)
  }
  SendEmailPopUp() {
    if (this.eamialIds && this.eamialIds.length) {
      this.myservices.saveEamilIds(this.eamialIds);
      let dialogRef = this._dialog.open(DialogContent);

      dialogRef.afterClosed().subscribe(result => {
        this.lastDialogResult = result;
      })

    }
    else {
      alert("select student")
    }
  }

  changeDepartment(e, Value) {
    this.loading = true;
    this.value = Value;
    this.studentDepartmantWise = [];
    this.loading = false;
    this.isStudentData = true;
    if (this.StudentArray.length) {
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

  PostVecancy(data) {
    data.Company_Id = this.tempID.id
    const promise = this.Vecancy.push(data)
    promise
      .then(_ => console.log('success'))
      .catch(err => console.log(err, 'You do not have access!'));
  }

  ViewResume(id) {

    this.af.database.list('/resume/', { query: { orderByChild: 'studentID', equalTo: id } })
      .subscribe(resume => {
        this.resume = resume;

        let storageRef = this.firebaseApp.storage().ref();
        var starsRef = storageRef.child('/resume/' + id + "/" + this.resume[0].filename);

        // Get the download URL
        starsRef.getDownloadURL().then(function (url) {
          // Insert url into an <img> tag to "download"
          //console.log("url" , url)        
          location.href = url;
        }).catch(function (error) {
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
      })


  }
  ngOnInit() {
  }

}






@Component({
  template: `
  <div id="mainDiv">    
                
      <form #form="ngForm" (ngSubmit)="EmailSend(form.value)" class="ui form">
        <md-input-container style="width: 27em"> 
          <md-icon class="subject"></md-icon>
          <input  md-input  placeholder="Subject" type="text" name="Subject" required ngModel>
        </md-input-container><br>            
        <md-textarea placeholder="Text" name="Text" required ngModel maxLength="200" style="width: 27em">
        </md-textarea><br>        
        <button md-raised-button type="submit" color="primary">SEND</button>
      </form>
        
  </div>
  `,
})
export class DialogContent {
  constructor( @Optional() public dialogRef: MdDialogRef<DialogContent>, private http: Http, private _dialog: MdDialog, public myservices: GeneralService) { }
  emailObj = {};
  EamilIds;
  private baseUrl = 'http://zaavia-emailer.herokuapp.com/email';
  sendEmail(emailObj) {
    return this.http.post(this.baseUrl, emailObj)
  }

  EmailSend(data) {
    this.EamilIds = this.myservices.getEamilIds()
    this.emailObj = {
      To: this.EamilIds,
      Subject: data.Subject,
      Message: data.Text
    }

    this.sendEmail(this.emailObj).subscribe(sucsess => {
      console.log(sucsess)
      let dialogRef = this._dialog.open(DialogContent);
      dialogRef.afterClosed()
    }, error => {
      console.log(error)
    })
  }
}