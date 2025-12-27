import {Component, Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {formatDate, NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from '../../../../app.component';
import {
  createNaboryStudentsInterface, deleteNaboryStudent, getNaboryStudent,
  updateNaboryStudent
} from '../../../../shared/service/core/secretariat/nabory/students';
import {getNaboryClasses, responseNaboryClassesInterface} from '../../../../shared/service/core/secretariat/nabory/classes';

@Component({
  selector: 'app-edit-student',
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    FormsModule
  ],
  templateUrl: './edit-student.component.html',
  standalone: true,
})
export class EditStudentComponent extends AppComponent {
  public buildFetch: createNaboryStudentsInterface = {
    user_name: '',
    user_lastname: '',
    gender: null,
    status: 1,
    id_class_suggestion: null,
  };

  public classList: responseNaboryClassesInterface[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      userId: number
    }
  ) {
    super();

    this.isProgress = true;

    this.getClassesNabory();
    this.getStudentFetch();
  }

  async getStudentFetch(): Promise<void> {
    try {
      const response = getNaboryStudent(this.data.userId);

      this.isProgress = false;

      this.buildFetch = await response;
    } catch (e) {
      this.isProgress = true;

      this.openSnackBar('Wystąpił błąd, podczas aktualizowania kandydata.', 'OK');
    }
  }

  async updateStudent(): Promise<void> {
    try {
      this.buildFetch = {
        ...this.buildFetch,
        birthday: this.buildFetch?.birthday ? formatDate(this.buildFetch?.birthday, 'Y-MM-dd', 'en') : undefined,
      }

      await updateNaboryStudent(
        this.data.userId,
        this.buildFetch
      );

      this.openSnackBar('Kandydant został zaktualizowany.', 'OK');
    } catch (e) {
      this.openSnackBar('Wystąpił błąd, podczas aktualizowania kandydata.', 'OK');
    }
  }

  async getClassesNabory(): Promise<void> {
    this.classList = await getNaboryClasses();
  }

  async deleteStudent(): Promise<void> {
    try {
      const response = await deleteNaboryStudent(this.data.userId);

      if (response?.error == 'Student not found.') {
        this.openSnackBar('Nie znaleziono kandydata.', 'OK');

        return;
      }

      this.openSnackBar('Kandydant został usunięty z systemu.', 'OK');
    } catch (e) {
      this.openSnackBar('Wystąpił błąd, podczas usuwania kandydata.', 'OK');
    }
  }
}
