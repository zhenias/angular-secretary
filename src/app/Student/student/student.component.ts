import {Component, ChangeDetectorRef, inject, NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {LoadingHTMLComponent} from '../../loading-html/loading-html.component';
import {NgFor, NgIf} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {DodajUczniaDoKlasyComponent} from '../dodaj-ucznia-do-klasy/dodaj-ucznia-do-klasy.component';
import {UsunUczniaZKlasyComponent} from '../usun-ucznia-zklasy/usun-ucznia-zklasy.component';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {SkreslUczniaZKlasyComponent} from '../skresl-ucznia-zklasy/skresl-ucznia-zklasy.component';
import {MatTab, MatTabGroup, MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {ResetPasswordComponent} from '../reset-password/reset-password.component';
import {CreateParentComponent} from '../../Parents/create-parent/create-parent.component';
import {DeleteParentComponent} from '../../Parents/delete-parent/delete-parent.component';
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';

interface ClassInfo {
  id?: number,
  class: string,
  symbol: string,
  level: number,
  unit: {
    id: number,
    name: string,
    short: string,
    maxLevel: number,
  },
  year?: string
}

interface StateSchool {
  id: number,
  id_number: number,
  w_klasie_od: string,
  full_user_name: string,
  data_skreslenia: string,
  powod_skreslenia: string,
  data_dodania: string,
  class: ClassInfo
}

interface StudentInfo {
  id?: number,
  user_name?: string,
  user_lastname?: string,
  full_user_name?: string,
  is_student?: boolean,
  is_parent?: boolean,
  class?: ClassInfo,
  pesel?: number | null,
  data_urodzenia?: string,
  adres_zamieszkania?: string | null,
  adres_zameldowania?: string | null,
  email?: string | null,
  login?: string,
  alias?: string | null,
  data_rejestracji?: string,
  is_active?: boolean,
  is_zsk?: boolean,
  is_ni?: boolean,
  numer_telefonu?: number,
  plec?: number,
}

interface SPE {
  user?: string,
  year?: number,
  year2?: number,
  cele_pracy?: string,
  metody_pracy?: string,
  dostosowania?: string,
  inne_informacje?: string,
  is_share?: number,
  status?: string,
  date?: string,
  user_add?: string,
}

interface Parents {
  name?: string,
  login?: string,
  level?: string,
  date?: string,
  plec?: string,
  user_id?: number,
}

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
  ],
  providers: [
    MatDatepickerModule,
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent extends AppComponent {
  public student: StudentInfo = {
    id: 0,
    user_name: '',
    user_lastname: '',
    full_user_name: '',
    is_student: false,
    is_parent: false,
    pesel: null,
    data_urodzenia: '',
    adres_zamieszkania: null,
    adres_zameldowania: null,
    email: null,
    login: '',
    alias: null,
    data_rejestracji: '',
    is_active: true,
    is_zsk: false,
    is_ni: false,
    plec: 0,
  };

  public studentStateSchool: StateSchool[] = [];
  public spe_list: SPE[] = [];
  public exams_list: any[] = [];
  public parents_list: Parents[] = [];

  readonly dialog = inject(MatDialog);

  constructor(private http: HttpClient, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    super();

    this.isProgress = true;

    this.getStudent();
  }

  public dodajUczniaDoKlasy() {
    const dialogRef = this.dialog.open(DodajUczniaDoKlasyComponent, {
      data: {class: this.student.class, student: this.student},
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(next => {
      this.isProgress = true;

      this.getStudentStateSchool();
    });
  }

  public usunUczniaZKlasy(classInfo: ClassInfo) {
    const dialogRef = this.dialog.open(UsunUczniaZKlasyComponent, {
      data: {
        class: classInfo,
        student: this.student
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isProgress = true;

      this.getStudentStateSchool();
    });
  }

  public skreslUcznia(classInfo: ClassInfo) {
    const dialogRef = this.dialog.open(SkreslUczniaZKlasyComponent, {
      data: {
        class: classInfo,
        student: this.student
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isProgress = true;

      this.getStudentStateSchool();
    });
  }

  public resetPasswordForUser(fullUserName?: string, userId?: number) {
    this.dialog.open(ResetPasswordComponent, {
      data: {
        userId: userId,
        user_name: fullUserName,
      },
      width: '400px'
    });
  }

  public createAccountParent() {
    const dialogRef = this.dialog.open(CreateParentComponent, {
      data: {
        studentId: this.student.id,
        user_name: this.student.user_name,
        user_lastname: this.student.user_lastname
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStudentParents();
    });
  }

  public deleteAccountParent(parentId?: number, parent_user_name?: string) {
    const dialogRef = this.dialog.open(DeleteParentComponent, {
      data: {
        studentId: this.student.id,
        parent_user_name: parent_user_name,
        parentId: parentId,
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStudentParents();
    });
  }

  private getStudent() {
    const headers = this.setHeaderAuthorization();

    const userId = this.route.snapshot.paramMap.get('userId');

    this.http.get<StudentInfo>('/api/School/Students/' + userId, {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.student = data;

        this.getStudentStateSchool();
        this.getStudentSPE();
        this.getStudentExams();
        this.getStudentParents();

        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isProgress = false;

        this.openSnackBar('Brak informacji o użytkowniku.', 'OK');
      }
    });
  }

  protected async getStudentSave() {
    this.isProgress = true;

    const header = this.setHeaderAuthorization();

    const headers = header.set('Content-Type', 'application/json');

    const userId = this.route.snapshot.paramMap.get('userId');

    this.http.post<StudentInfo>('/api/School/Students/' + userId, this.student, {headers: headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.student = data;

        this.openSnackBar('Dane użytkownika zostały zapisane.', 'OK');
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isProgress = false;
        this.openSnackBar('Wystąpił błąd, podczas aktualizacji użytkownika.', 'OK');
      }
    });
  }

  private async getStudentStateSchool() {
    const headers = this.setHeaderAuthorization();

    const userId = this.route.snapshot.paramMap.get('userId');

    this.http.get<any[]>('/api/School/Students/' + userId + '/StateSchool', {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.studentStateSchool = data;
      },
      error: (error) => {
        this.isProgress = false;
        this.studentStateSchool = [];

        if (error.response.error != "State not found.") {
          this.openSnackBar('Błąd pobierania pobytu ucznia w szkole.', 'OK');
        }
      }
    });
  }

  private async getStudentSPE() {
    const headers = this.setHeaderAuthorization();

    const userId = this.route.snapshot.paramMap.get('userId');

    this.http.get<any[]>('/api/School/Students/' + userId + '/DIU', {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.spe_list = data;
      },
      error: (error) => {
        this.isProgress = false;
        this.spe_list = [];

        if (error.response.error != "SPE not found.") {
          this.openSnackBar('Błąd pobierania dodatkowych informacji.', 'OK');
        }
      }
    });
  }

  private async getStudentExams() {
    const headers = this.setHeaderAuthorization();

    const userId = this.route.snapshot.paramMap.get('userId');

    this.http.get<any[]>('/api/School/Students/' + userId + '/Exams', {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.exams_list = data;
      },
      error: (error) => {
        this.isProgress = false;

        this.exams_list = [];
      }
    });
  }

  private async getStudentParents() {
    const headers = this.setHeaderAuthorization();

    const userId = this.route.snapshot.paramMap.get('userId');

    this.http.get<Parents[]>('/api/School/Students/' + userId + '/Parents', {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.parents_list = data;
      },
      error: (error) => {
        this.isProgress = false;

        this.exams_list = [];
      }
    });
  }
}
