import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { LoadingHTMLComponent } from '../../../shared/components/loading-html/loading-html.component';
import { getStudentParents } from '../../../shared/service/core/secretariat/student/parent.service';
import { getStudent, getStudentDIU, updateStudent } from '../../../shared/service/core/secretariat/student/student.service';
import { CreateParentComponent } from '../../Parents/create-parent/create-parent.component';
import { DeleteParentComponent } from '../../Parents/delete-parent/delete-parent.component';
import { DodajEgzaminComponent } from '../../Rejestry/egzaminy/dodaj-egzamin/dodaj-egzamin.component';
import {
  BicycleCardCreateComponent
} from '../../Rejestry/KartyRowerowe/bicycle-card-create/bicycle-card-create.component';
import { DodajUczniaDoKlasyComponent } from '../dodaj-ucznia-do-klasy/dodaj-ucznia-do-klasy.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { SkreslUczniaZKlasyComponent } from '../skresl-ucznia-zklasy/skresl-ucznia-zklasy.component';
import { ClassInfo, Parents, SPE, StateSchool, StudentInfo } from '../students.types';
import { UsunUczniaZKlasyComponent } from '../usun-ucznia-zklasy/usun-ucznia-zklasy.component';
import { PrintDokumentyComponent } from '../../dokumenty/print-dokumenty/print-dokumenty.component';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoadingHTMLComponent,
    NgIf,
    NgFor,
    MatCardModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTooltipModule,
    NgClass,
    MatSort,
    MatSortHeader,
    MatProgressSpinnerModule,
  ],
  providers: [
    MatDatepickerModule,
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent extends AppComponent {
  public student: StudentInfo = {};
  public editMode: boolean = false;

  public studentStateSchool: StateSchool[] = [];
  public spe_list: SPE[] = [];
  public exams_list: any[] = [];
  public parents_list: Parents[] = [];

  public isLoadingSPE = true;
  public isLoadingExams = true;
  public isLoadingParents = true;
  public isLoadingStateSchool = true;

  displayedColumnsParents: string[] = [
    'parent',
    'plec',
    'level',
    'login',
    'date',
    'actions',
  ];
  dataSourceParents = new MatTableDataSource<any>();
  @ViewChild(MatSort) sortParents!: MatSort;

  displayedColumnsStatsSchool: string[] = [
    'actions',
    'nr_dz',
    'teacher',
    'oddzial',
    'rok_szkolny',
    'okres_nauczania',
    'powod_skreslenia',
    'data_dodania',
  ];
  dataSourceStatsSchool = new MatTableDataSource<any>();
  @ViewChild(MatSort) sortStatsSchool!: MatSort;

  displayedColumnsDIU: string[] = [
    'rok',
    'cele_pracy',
    'metody_pracy',
    'dostosowania',
    'inne_informacje',
    'date',
    'user_add',
  ];
  dataSourceDIU = new MatTableDataSource<any>();
  @ViewChild(MatSort) sortDIU!: MatSort;

  readonly dialog = inject(MatDialog);

  constructor(private http: HttpClient, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    super();

    this.isProgress = true;

    this.getStudent();
  }

  onPanelOpen(label: string): void {
    if (label === 'Rodzice / Opiekunowie' && !this.parents_list?.length) {
      this.getStudentParentsFetch();
    }

    if (label === 'Egzaminy' && !this.exams_list?.length) {
      this.getStudentExams();
    }

    if (label === 'Dokumenty' && !this.spe_list?.length) {
      this.getStudentSPE();
    }

    if (label === 'Pobyt ucznia' && !this.studentStateSchool?.length) {
      this.getStudentStateSchool();
    }
  }

  public dodajUczniaDoKlasy() {
    const dialogRef = this.dialog.open(DodajUczniaDoKlasyComponent, {
      data: {
        class: this.student.class,
        student: this.student
      },
      width: '700px',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe(next => {
      this.isLoadingStateSchool = true;

      this.getStudentStateSchool();
    });
  }

  public usunUczniaZKlasy(classInfo: ClassInfo) {
    const dialogRef = this.dialog.open(UsunUczniaZKlasyComponent, {
      data: {
        class: classInfo,
        student: this.student
      },
      width: '700px',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStudentStateSchool();
    });
  }

  public skreslUcznia(classInfo: ClassInfo) {
    const dialogRef = this.dialog.open(SkreslUczniaZKlasyComponent, {
      data: {
        class: classInfo,
        student: this.student
      },
      width: '700px',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStudentStateSchool();
    });
  }

  public resetPasswordForUser(fullUserName?: string, userId?: number) {
    this.dialog.open(ResetPasswordComponent, {
      data: {
        userId: userId,
        user_name: fullUserName,
      },
      width: '500px',
      height: '500px',
    });
  }

  public createAccountParent() {
    const dialogRef = this.dialog.open(
      CreateParentComponent,
      {
        width: '600px',
        height: '500px',
        data: {
          studentId: this.student.id,
          user_name: this.student.user_name,
          user_lastname: this.student.user_lastname
        }
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      this.getStudentParentsFetch();
    });
  }

  public deleteAccountParent(parentId?: number, parent_user_name?: string) {
    const dialogRef = this.dialog.open(DeleteParentComponent, {
      data: {
        studentId: this.student.id,
        parent_user_name: parent_user_name,
        parentId: parentId,
      },
      width: '500px',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStudentParentsFetch();
    });
  }

  public async getStudentStateSchool() {
    this.isLoadingStateSchool = true;

    const headers = this.setHeaderAuthorization();

    const userId = this.route.snapshot.paramMap.get('userId');

    this.http.get<any[]>('/api/School/Students/' + userId + '/StateSchool', {headers}).subscribe({
      next: (data) => {
        this.isLoadingStateSchool = false;

        this.studentStateSchool = data;
        this.dataSourceStatsSchool.data = data;
        this.dataSourceStatsSchool.sort = this.sortStatsSchool;
      },
      error: (error) => {
        this.isLoadingStateSchool = false;

        if (error.response.error != "State not found.") {
          this.openSnackBar('Błąd pobierania pobytu ucznia w szkole.', 'OK');
        }
      }
    });

    this.dataSourceStatsSchool.sort = this.sortStatsSchool;
  }

  async getStudentSPE() {
    this.isLoadingSPE = true;

    const userId = Number(this.route.snapshot.paramMap.get('userId'));

    await getStudentDIU(userId)
    .then((response) => {
      this.dataSourceDIU.data = response;
    })
    .catch((response) => {
      console.log(response);
      if (response?.error === 'SPE not found.') return;
      this.openSnackBar('Wystąpił błąd, podczas pobierania dodatkowych informacji o uczniu.');
    })
    .finally(() => {
      this.isLoadingSPE = false;

      this.dataSourceDIU.sort = this.sortDIU;
    });
  }

  public async getStudentExams() {
    this.isLoadingExams = true;

    const headers = this.setHeaderAuthorization();

    const userId = this.route.snapshot.paramMap.get('userId');

    this.http.get<any[]>('/api/School/Students/' + userId + '/Exams', {headers}).subscribe({
      next: (data) => {
        this.isLoadingExams = false;

        this.exams_list = data;
      },
      error: (error) => {
        this.isLoadingExams = false;

        this.exams_list = [];
      }
    });
  }

  public async getStudentParentsFetch() {
    this.isLoadingParents = true;

    const userId = Number(this.route.snapshot.paramMap.get('userId'));

    try {
      getStudentParents(userId)
      .finally(() => {
        this.isLoadingParents = false;
        this.dataSourceParents.sort = this.sortParents;
      })
      .then((response) => {
        this.parents_list = response;
        this.dataSourceParents.data = response;
        this.dataSourceParents.sort = this.sortParents;
      });
    } catch (e) {
      this.openSnackBar('Wystąpił błąd, podczas pobierania informacji o rodzicach/opiekunach.', 'OK');
      this.isLoadingParents = false;
    }
  }

  bicycleCardCreate() {
    this.matDialog.open(BicycleCardCreateComponent, {
      width: '600px',
      height: '500px',
      data: {
        studentId: this.student.id,
        classId: this.student.class?.id,
      }
    });
  }

  async getStudentSave() {
    this.isProgress = true;

    const userId = Number(this.route.snapshot.paramMap.get('userId'));

    try {
      updateStudent(
        userId,
        this.student
      )
      .finally(() => {
        this.isProgress = false;
        this.editMode = false;
      })
      .then((response) => {
        this.student = response;

        this.openSnackBar('Dane użytkownika zostały zapisane.', 'OK');
        this.cdr.detectChanges();
      });
    } catch (e) {
      this.isProgress = false;
      this.editMode = false;

      this.openSnackBar('Wystąpił błąd, podczas aktualizacji informacji o uczniu/rodzicu.', 'OK');
    }
  }

  async getStudent() {
    const userId = Number(this.route.snapshot.paramMap.get('userId'));

    try {
      getStudent(userId)
        .finally(() => {
          this.isProgress = false;
        })
        .then((response) => {
          this.student = response;

          this.cdr.detectChanges();
        });
    } catch (e) {
      this.isProgress = false;
      this.openSnackBar('Wystąpił błąd, podczas pobierania informacji o uczniu/rodzicu.', 'OK');
    }
  }

  examCreate() {
    const dialog = this.matDialog.open(
      DodajEgzaminComponent,
      {
        width: '600px',
        height: '400px',
        data: {
          classId: this.student.class?.id,
          studentId: this.student.id,
        }
      }
    );

    dialog.afterClosed().subscribe(result => {
      this.isLoadingExams = true;

      this.getStudentExams();
    });
  }

  printDokument() {
    this.matDialog.open(
      PrintDokumentyComponent,
      {
        width: '900px',
        maxWidth: '100%',
        height: '900px',
        maxHeight: '100vh',
        data: {
          classId: this.student?.class?.id,
          studentId: this.student?.id,
        }
      }
    );
  }
}
