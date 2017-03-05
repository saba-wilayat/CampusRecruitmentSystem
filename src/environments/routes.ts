import { RouterModule, Routes } from '@angular/router';
import { AppComponent }          from '../app/app.component';
import { CompanyComponent }          from '../app/components/company/company.component';
import { HomeComponent }          from '../app/components/home/home.component';
import { StudentComponent }          from '../app/components/student/student.component';
import { RegisterCompanyUserViewComponent }          from '../app/components/register-company-user-view/register-company-user-view.component';
import { StudentViewDetailComponent }          from '../app/components/student-view-detail/student-view-detail.component';
import { AddVecancyComponent }          from '../app/components/add-vecancy/add-vecancy.component';
import { RegisteredStudentViewComponent }          from '../app/components/registered-student-view/registered-student-view.component';
import { AdminComponent } from '../app/components/admin/admin.component';

export const appRoutes: Routes = [  
  //{ path: 'studentRegisteration', component: CompanyComponent },
  { path: 'Login', component: HomeComponent },  
  { path: 'companyRegistration', component: CompanyComponent },
  { path: 'AdminView/:id', component: AdminComponent },
  { path: 'studentViewDetail', component: StudentViewDetailComponent },
  { path: 'studentRegistration', component: StudentComponent },
  { path: 'RegisterCompnayUserView/:id', component: RegisterCompanyUserViewComponent },
   { path: 'RegisterStudentView/:id', component: RegisteredStudentViewComponent },
  { path: 'addVecancy', component: AddVecancyComponent }
];
