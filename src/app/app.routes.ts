import {Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ClassesComponent} from './School/Classes/classes/classes.component';
import {StudentInClassComponent} from './School/Classes/student-in-class/student-in-class.component';
import {Error404Component} from './Errors/error404/error404.component';
import {StudentsComponent} from './Students/students/students.component';
import {StudentComponent} from './Student/student/student.component';
import {StudentInSchoolComponent} from './Students/student-in-school/student-in-school.component';
import {LessonPlanForClassComponent} from './School/Classes/lesson-plan-for-class/lesson-plan-for-class.component';
import {ErrorPermissionComponent} from './Errors/error-permission/error-permission.component';
import {ExportUIComponent} from './School/Exports/export-ui/export-ui.component';
import {ViewParentsComponent} from './Parents/view-parents/view-parents.component';
import {TeachersListComponent} from './School/Teachers/teachers-list/teachers-list.component';
import {EditTeacherComponent} from './School/Teachers/edit-teacher/edit-teacher.component';

export const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},

  {path: 'teachers', component: TeachersListComponent},
  {path: 'teachers/edit/:userId', component: EditTeacherComponent},

  {path: 'classes', component: ClassesComponent},
  {path: 'classes/:classId/students', component: StudentInClassComponent},
  {path: 'classes/:classId/lesson_plan', component: LessonPlanForClassComponent},

  {path: 'students/edit/:userId', component: StudentComponent},
  {path: 'candidates', component: StudentInSchoolComponent},
  {path: 'students', component: StudentsComponent},

  {path: 'parents', component: ViewParentsComponent},

  {path: 'exports', component: ExportUIComponent},

  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'error/404'},
  {path: 'error/404', component: Error404Component},
  {path: 'error/permission', component: ErrorPermissionComponent},
];
