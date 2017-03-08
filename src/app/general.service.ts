import { Component, OnInit, Injectable, Optional, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods, FirebaseApp } from "angularfire2"
import { firebaseLoginPolicy } from './app.module';
import { Observable, Subject } from "rxjs";
import { RouterModule, Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import * as firebase from 'firebase';

// import promise from "promise"

import { } from 'promise'
@Injectable()

export class GeneralService {
  studentList: FirebaseListObservable<any>;
  studentsListSubject: Subject<any>;
  imageSubject: Subject<any>;
  userTypeSubject: Subject<any>;
  loginUserSubject: Subject<any>;
  student: any;
  IDs;
  CompanyID;
  constructor(public af: AngularFire, public router: Router, private _dialog: MdDialog, @Inject(FirebaseApp) private firebaseApp: firebase.app.App) {
    this.student = {};
    this.studentsListSubject = new Subject();
    this.userTypeSubject = new Subject();
    this.imageSubject = new Subject();
    this.loginUserSubject = new Subject();

  }


  logout() {
    return this.af.auth.logout()
  };
  login(email, password) {
    return this.af.auth.login({ email: email, password: password }, firebaseLoginPolicy)
  };

  createUser(email, password) {
    return this.af.auth.createUser({ email: email, password: password })
  };

  getUserDataByQuery() {
    console.log("this.studentList", this.studentList)
    this.studentList = this.af.database.list('/Student/Registration')

  }

  getStudentsSubject() {
    this.studentsListSubject
    return this.studentsListSubject;
  }
  getLoginUserSubject() {
    this.loginUserSubject
    return this.loginUserSubject;
  }


  saveEamilIds(IDs) {
    this.IDs = IDs
  }
  getEamilIds() {
    return this.IDs;
  }
  setValue(id){
    this.CompanyID = id
  }
  getCompnayID(){
  return this.CompanyID;
  }
  getStudentsDataFromFB() {
    this.af.database.list('/Student/Registration', { query: { orderByChild: 'UserType', equalTo: 'Student' } })
      .subscribe(students => {
        this.student.students = students;        
        console.log("this.student", this.student)
        this.studentsListSubject.next(this.student);
      });
  }

  checkUserType(id) {
    this.af.database.list('/Student/Registration', { query: { orderByChild: 'UserID', equalTo: id } })
      .subscribe(students => {
        if (students && students.length) {
          this.loginUserSubject.next(students[0]);
          this.router.navigate(['RegisterStudentView/', students[0].$key]);
        }
        else {
          this.af.database.list('/Company/Registration', { query: { orderByChild: 'UserID', equalTo: id } })
            .subscribe(compamy => {
               console.log("compamy" , compamy)
              if (compamy && compamy.length) {
                this.loginUserSubject.next(compamy[0]);
                this.router.navigate(['RegisterCompnayUserView', compamy[0].$key]);
              }
              else {
                this.af.database.list('/Admin/Registration', { query: { orderByChild: 'UserID', equalTo: id } })
                  .subscribe(admin => {
                    if (admin && admin.length) {
                      this.loginUserSubject.next(admin[0]);
                      this.router.navigate(['AdminView', admin[0].$key]);
                    }                   

                  });
              }

            });
        }

      });
  }
  getURLSubject() {
    this.imageSubject
    return this.imageSubject;
  }

  SaveLogoAndGetURL(selectedFile) {
    let storageRef = this.firebaseApp.storage().ref();
    var uploadTask = storageRef.child('/logoes/' + selectedFile.name)
      .put(selectedFile).then(
      success => {
        if (success) {
          storageRef.child('/logoes/' + selectedFile.name).getDownloadURL().then(s => {
            this.imageSubject.next(s)
          })

        }
      }
      , error => {
        alert(error);
      })
    // .on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot){
    //   console.log('Uploaded a blob or file! Now storing the reference at');
    //   this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //   console.log('Upload is ' + this.progress + '% done')


    // }, function (error) {

    // }, function () {
    //   // Upload completed successfully, now we can get the download URL
    //   console.log('Upload is completed');        
    // });
  }


  SaveImageAndGetURL(selectedFile) {
    let storageRef = this.firebaseApp.storage().ref();
    var uploadTask = storageRef.child('/images/' + selectedFile.name)
      .put(selectedFile).then(
      success => {
        if (success) {
          storageRef.child('/images/' + selectedFile.name).getDownloadURL().then(s => {
            this.imageSubject.next(s)
          })

        }
      }
      , error => {
        alert(error);
      })
    // .on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot){
    //   console.log('Uploaded a blob or file! Now storing the reference at');
    //   this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //   console.log('Upload is ' + this.progress + '% done')


    // }, function (error) {

    // }, function () {
    //   // Upload completed successfully, now we can get the download URL
    //   console.log('Upload is completed');        
    // });
  }


}



