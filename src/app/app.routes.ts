import {Routes} from '@angular/router';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {ClassesComponent} from './features/School/Classes/classes/classes.component';
import {StudentInClassComponent} from './features/School/Classes/student-in-class/student-in-class.component';
import {Error404Component} from './shared/error/error404/error404.component';
import {StudentsComponent} from './features/Students/students/students.component';
import {StudentComponent} from './features/Student/student/student.component';
import {StudentInSchoolComponent} from './features/Students/student-in-school/student-in-school.component';
import {
  LessonPlanForClassComponent
} from './features/School/Classes/lesson-plan-for-class/lesson-plan-for-class.component';
import {ErrorPermissionComponent} from './shared/error/error-permission/error-permission.component';
import {ViewParentsComponent} from './features/Parents/view-parents/view-parents.component';
import {TeachersListComponent} from './features/School/Teachers/teachers-list/teachers-list.component';
import {EditTeacherComponent} from './features/School/Teachers/edit-teacher/edit-teacher.component';
import {
  RejestrKartRowerowychComponent
} from './features/Rejestry/KartyRowerowe/rejestr-kart-rowerowych/rejestr-kart-rowerowych.component';
import {ViewStudentsComponent} from './features/Nabory/NaboryStudents/view-students/view-students.component';
import {ViewClassesComponent} from './features/Nabory/NaboryClasses/view-classes/view-classes.component';
import {ViewUnitsComponent} from './features/School/Units/view-units/view-units.component';
import {ViewEgzaminyComponent} from './features/Rejestry/egzaminy/view-egzaminy/view-egzaminy.component';
import {ViewWycieczkiComponent} from './features/Rejestry/wycieczki/view-wycieczki/view-wycieczki.component';
import {ViewDokumentyComponent} from './features/dokumenty/view-dokumenty/view-dokumenty.component';
import {ViewUwagiComponent} from './features/Rejestry/uwagi/view-uwagi/view-uwagi.component';
import {ViewDiuComponent} from './features/Rejestry/diu/view-diu/view-diu.component';

export const routes: Routes = [
  {
    path: '',
    // canActivate: [authGuard],
    children: [
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},

      {path: 'employees', component: TeachersListComponent},
      {path: 'employees/edit/:userId', component: EditTeacherComponent},

      {path: 'units', component: ViewUnitsComponent},

      {path: 'classes', component: ClassesComponent},
      {path: 'classes/:classId/students', component: StudentInClassComponent},
      {path: 'classes/:classId/lesson_plan', component: LessonPlanForClassComponent},

      {path: 'students', component: StudentsComponent},
      {path: 'students/edit/:userId', component: StudentComponent},
      {path: 'candidates', component: StudentInSchoolComponent},

      {path: 'parents', component: ViewParentsComponent},

      {path: 'bicycle-cards', component: RejestrKartRowerowychComponent},
      {path: 'exams', component: ViewEgzaminyComponent},
      {path: 'wycieczki', component: ViewWycieczkiComponent},
      {path: 'dokumenty', component: ViewDokumentyComponent},
      {path: 'uwagi', component: ViewUwagiComponent},
      {path: 'diu', component: ViewDiuComponent},

      {path: 'nabory/classes', component: ViewClassesComponent},
      {path: 'nabory/candidates', component: ViewStudentsComponent},
    ]
  },

  // error
  {path: 'error/not-found', component: Error404Component},
  {path: 'error/no-permission', component: ErrorPermissionComponent},
  {path: '**', component: Error404Component},
];
