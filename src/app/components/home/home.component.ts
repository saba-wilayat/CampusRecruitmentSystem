import { Component, OnInit, Optional} from '@angular/core';
import {AngularFire, FirebaseListObservable , AuthProviders, AuthMethods } from 'angularfire2';
import { firebaseLoginPolicy } from '../../app.module';
import {GeneralService} from "../../general.service"
import { RouterModule, Router }  from '@angular/router';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
restration: FirebaseListObservable<any>;
loading = false;
  constructor(public af: AngularFire , public myservices : GeneralService, public router : Router,private _dialog: MdDialog) {
       
  }
  
login(data){
  console.log("hara" , data)
    this.loading = true;
    this.myservices.login(data.Email,data.Password).then(
      success =>
    {
      if(success && success.uid){        
         this.myservices.checkUserType(success.uid)
        this.loading = false;
      }
    }
    ,error =>{
          alert(error);
    })
    
  }  
  ngOnInit() {
  }

}


@Component({
  template: `
    <p>This is a dialog</p>
    <p>
      <label>
        This is a text box inside of a dialog.
        <input #dialogInput>
      </label>
    </p>
    <p> <button md-button (click)="dialogRef.close(dialogInput.value)">CLOSE</button> </p>
  `,
})
export class DialogContent {
  constructor(@Optional() public dialogRef: MdDialogRef<DialogContent>) { }
}