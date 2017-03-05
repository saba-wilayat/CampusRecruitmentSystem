import { Component, OnInit, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods, FirebaseApp } from 'angularfire2';
import { firebaseLoginPolicy } from '../../app.module';
import { GeneralService } from "../../general.service"
import { RouterModule, Router } from '@angular/router';
import * as firebase from 'firebase';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent implements OnInit {
  isRegistration = false;
  image;
  url;
  registrationPage() {
    this.isRegistration = true;
    this.matchCompany = false;
  }
  restration: FirebaseListObservable<any>;
  public auth: any;
  matchCompany = false;
  constructor(public af: AngularFire, public myservices: GeneralService, public router: Router, @Inject(FirebaseApp) private firebaseApp: firebase.app.App) {
    this.restration = af.database.list('/Company/Registration');
  } 


  CompanyRegistrat(data) {
    if (data.Email && data.Password) {
      this.myservices.createUser(data.Email, data.Password).then(
        success => {
          console.log('success', success)
          if (success && success.uid) {
            delete data.password;
            data.UserID = success.uid;
            data.UserType = "Company";
            if (this.url) {
              data.logoURL = this.url;
            }

            const promise = this.restration.push(data)
            promise
              .then(_ => this.router.navigate(['Login']))
              .catch(err => console.log(err, 'You do not have access!'));
          }
        },

        error =>
        { })
    }

  }

  login(data) {
    console.log("---data---", data)
    this.myservices.login(data.Email, data.Password).then(
      success => {
        if (success && success.uid) {
          this.router.navigate(['RegisterCompnayUserView']);
          //this.matchCompany = true;
        }
      }
      , error => {
        alert(error);
      })
      
  }
  LogoUpload() {
    var dataArray = []
    let success = false;
    let storageRef = this.firebaseApp.storage().ref();
    for (let selectedFile of [(<HTMLInputElement>document.getElementById('CompanyLogo')).files[0]]) {
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
