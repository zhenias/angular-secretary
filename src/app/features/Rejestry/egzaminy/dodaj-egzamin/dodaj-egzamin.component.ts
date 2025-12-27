import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatInput} from '@angular/material/input';
import {NgForOf} from '@angular/common';
import {MatOption, MatSelect} from '@angular/material/select';
import {AppComponent} from '../../../../app.component';
import {createExam, CreateExamTypes} from '../../../../shared/service/core/secretariat/student/exams.service';

@Component({
  selector: 'app-dodaj-egzamin',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatOption,
    MatSelect,
    NgForOf,
  ],
  templateUrl: './dodaj-egzamin.component.html',
  standalone: true
})
export class DodajEgzaminComponent extends AppComponent {
  public classes: any = [];
  public students: any = [];
  public createExam: CreateExamTypes = {
    nazwa: '',
    user_id: 0,
    wynik: ''
  };
  public classId: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      classId?: number,
      studentId?: number,
    }
  ) {
    super();

    if (data?.classId) {
      this.classId = data.classId;
    }

    if (data?.studentId) {
      this.createExam.user_id = data.studentId;

      this.getStudents();
    }

    this.getClasses();
  }

  getClasses(): void {
    const headers = this.setHeaderAuthorization();

    this.appHttp.get<any[]>('/api/School/Classes', {headers}).subscribe({
      next: (data) => {
        this.classes = data;
      },
    });
  }

  getStudents(): void {
    const headers = this.setHeaderAuthorization();

    this.appHttp.get<any>('/api/School/Classes/' + this.classId + '/Students', {headers}).subscribe({
      next: (data) => {
        this.students = data.students;
      },
    });
  }

  async createExamFetch() {
    await createExam({
      nazwa: this.createExam.nazwa,
      wynik: this.createExam.wynik,
      user_id: this.createExam.user_id,
    }).catch(() => {
      this.openSnackBar('Wystąpił błąd, podczas dodawania egzaminu.', 'OK');
    }).then(() => {
      this.openSnackBar('Egzamin został dodany.', 'OK');
    });
  }
}
