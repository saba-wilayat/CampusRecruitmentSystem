import { Component } from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import { RouterModule, Routes ,Router } from '@angular/router';
import {GeneralService} from "./general.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  UserName;
  UserImage;
  constructor(public af : AngularFire,public router: Router,public myservices : GeneralService){
    
    af.auth.subscribe(success=>{
      console.log("success" , success)
      this.UserName = "";
      if(success && success.uid){
        this.myservices.checkUserType(success.uid);
        this.myservices.getLoginUserSubject().subscribe(s=>{
          console.log("ssss" , s)
        if(s.UserType == "Company"){
          this.UserName = "Welcome " + s.CompanyName;
          this.UserImage = s.logoURL
        }
        else if(s.UserType == "Student"){
          this.UserName = "Welcome " + s.FirstName + " " + s.LastName;
          this.UserImage = s.imageURL
        }  
        else{
          this.UserName = "Welcome Admin"
          this.UserImage = "../../app/img/icons/admin.jpg";
        }        
          
        })
      }
      else{
        this.UserImage = ""
        //this.router.navigate(['Login'])  
      }
    })
  }

  logOut(){    
    this.af.auth.logout();
    this.router.navigate(['Login'])
  }
  title = 'app works!'; 
}
