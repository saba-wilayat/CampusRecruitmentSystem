import { Component, OnInit, Injectable,Optional } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
@Component({
  templateUrl: `../template.html`,  
})
@Injectable()
export class DialogServiceService {

 message;
  constructor( @Optional() public dialogRef: MdDialogRef<DialogServiceService>, public _dialog: MdDialog) { 
  
  }  
  OpenDialogBox(m){
  this.message = m; 
  alert(this.message)
  // let dialogRef = this._dialog.open(DialogServiceService);
  //         dialogRef.afterClosed().subscribe(result => {
            
  //  })
  }
}
