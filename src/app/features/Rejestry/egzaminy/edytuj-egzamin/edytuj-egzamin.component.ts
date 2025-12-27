import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  deleteExam,
  ExamTypes,
  getExam as getExamResponse,
  updateExam,
  UpdateExamTypes
} from '../../../../shared/service/core/secretariat/student/exams.service';
import {AppComponent} from '../../../../app.component';
import {NgIf} from '@angular/common';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';

@Component({
  selector: 'app-edytuj-egzamin',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    LoadingHTMLComponent
  ],
  templateUrl: './edytuj-egzamin.component.html',
})
export class EdytujEgzaminComponent extends AppComponent {
  updateExam: UpdateExamTypes = {
    nazwa: '',
    wynik: '',
  };

  examId: number = 0;

  getExam: ExamTypes = {
    create: '',
    date: '',
    id: 0,
    name: '',
    result: ''
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    examId: number,
  }) {
    super();

    this.isProgress = true;

    this.examId = data.examId;

    this.getExamFetch();
  }

  async getExamFetch() {
    this.isProgress = true;

    this.getExam = await getExamResponse(this.examId).finally(() => {
      this.isProgress = false;
    });
  }

  async updateExamFetch() {
    await updateExam(this.examId, {
      nazwa: this.getExam.name,
      wynik: this.getExam.result,
    }).catch(() => {
      this.openSnackBar('Wystąpił błąd, podczas edycji egzaminu.', 'OK');
    }).then(() => {
      this.openSnackBar('Egzamin został aktualizowany.', 'OK');
    });
  }

  async deleteExamFetch() {
    await deleteExam(this.examId).catch(() => {
      this.openSnackBar('Wystąpił błąd, podczas usuwania egzaminu.', 'OK');
    }).then(() => {
      this.openSnackBar('Egzamin został usunięty.', 'OK');
    });
  }
}
