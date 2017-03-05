import { Component, OnInit, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods, FirebaseApp } from 'angularfire2';
import { firebaseLoginPolicy } from '../../app.module';
import { GeneralService } from "../../general.service"
import { RouterModule, Routes, Router } from '@angular/router';
import * as firebase from 'firebase';


@Component({
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  image;
  url;
  isRegistration = false;
  registrationPage() {
    this.isRegistration = true;
    this.matchCompany = false;
  }
  restration: FirebaseListObservable<any>;
  public auth: any;
  matchCompany = false;
  constructor(public af: AngularFire, public router: Router, public myservices: GeneralService, @Inject(FirebaseApp) private firebaseApp: firebase.app.App) {
    this.restration = af.database.list('/Student/Registration');
  }

  UserRegister(data) {
    //console.log("====data====" , data)    
    this.myservices.createUser(data.Email, data.Password).then(
      success => {
        console.log('success', success)
        if (success && success.uid) {
          delete data.Password;
          data.UserID = success.uid;
          data.UserType = "Student";
          if (this.url) {
            data.imageURL = this.url;
          }

          console.log(data)
          const promise = this.restration.push(data)
          promise
            .then(_ =>
              this.router.navigate(['Login'])
            )
            .catch(err => console.log(err, 'You do not have access!'));
        }
      },

      error =>
      { })

  }

  login(data) {
    //console.log("======data" , data)
    this.myservices.login(data.Email, data.Password).then(
      success => {
        if (success && success.uid) {

        }
      }
      , error => {
        alert(error);
      })

  }


  ImageUpload() {
    var dataArray = []
    let success = false;
    let storageRef = this.firebaseApp.storage().ref();
    for (let selectedFile of [(<HTMLInputElement>document.getElementById('UserImage')).files[0]]) {
      this.image = selectedFile;
      this.myservices.SaveImageAndGetURL(selectedFile);
      this.myservices.getURLSubject()
        .subscribe(url => {
          this.url = url;

        })

    }
  }

  ngOnInit() {
  }
}
