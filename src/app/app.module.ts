import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CompanyComponent } from '../app/components/company/company.component';
import { AdminComponent } from '../app/components/admin/admin.component';
import {AngularFire, AuthMethods, AuthProviders} from 'angularfire2';
import {firebaseConfig} from '../environments/config';
import { AngularFireModule } from "angularfire2";
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule} from '@angular/material';
import {appRoutes} from '../environments/routes';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from '../app/components/home/home.component';
import { StudentComponent } from '../app/components/student/student.component';
import { StudentViewDetailComponent } from '../app/components/student-view-detail/student-view-detail.component';
import {GeneralService} from "./general.service"
import {DialogServiceService} from "./dialog-service.service"
import 'hammerjs';
import { RegisterCompanyUserViewComponent } from '../app/components/register-company-user-view/register-company-user-view.component';
import { AddVecancyComponent } from './components/add-vecancy/add-vecancy.component';
import { RegisteredStudentViewComponent } from './components/registered-student-view/registered-student-view.component';
import { FileSelectDirective } from 'ng2-file-upload';
import {DialogContent} from '../app/components/register-company-user-view/register-company-user-view.component';
import {StudentDialog} from '../app/components/registered-student-view/registered-student-view.component';


export const firebaseLoginPolicy = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password,
}
@NgModule({
  declarations: [
    AppComponent,
    CompanyComponent,    
    AdminComponent,
    HomeComponent,
    StudentComponent,
    StudentViewDetailComponent, 
    RegisterCompanyUserViewComponent,
    AddVecancyComponent,
    RegisteredStudentViewComponent,
    FileSelectDirective,
    DialogContent,
    StudentDialog,
    DialogServiceService
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),   
    RouterModule.forRoot(appRoutes),
    MaterialModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [GeneralService,DialogServiceService],
  entryComponents: [DialogContent,StudentDialog,DialogServiceService],
  bootstrap: [AppComponent]
  
})
export class AppModule {  
 
 }
