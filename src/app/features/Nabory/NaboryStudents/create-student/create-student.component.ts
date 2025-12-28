import {Component} from '@angular/core';
import {AppComponent} from '../../../../app.component';
import {
  createNaboryStudent,
  createNaboryStudentsInterface
} from '../../../../shared/service/core/secretariat/nabory/students';
import {
  getNaboryClasses,
  responseNaboryClassesInterface
} from '../../../../shared/service/core/secretariat/nabory/classes';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {formatDate, NgForOf} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-create-student',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    MatDatepickerModule,
  ],
  templateUrl: './create-student.component.html',
  standalone: true,
})
export class CreateStudentComponent extends AppComponent {
  public buildFetch: createNaboryStudentsInterface = {
    user_name: '',
    user_lastname: '',
    gender: null,
    status: 1,
    id_class_suggestion: null,
  };

  public classList: responseNaboryClassesInterface[] = [];

  constructor() {
    super();

    this.isProgress = true;

    this.getClassesNabory();
  }

  async createStudent(): Promise<void> {
    try {
      this.buildFetch = {
        ...this.buildFetch,
        birthday: this.buildFetch?.birthday ? formatDate(this.buildFetch?.birthday, 'Y-MM-dd', 'en') : undefined,
      }

      await createNaboryStudent(this.buildFetch);

      this.openSnackBar('Kandydant został dodany.', 'OK');
    } catch (e) {
      this.openSnackBar('Wystąpił błąd, podczas dodawania kandydata.', 'OK');
    }
  }

  async getClassesNabory(): Promise<void> {
    this.classList = await getNaboryClasses();
  }
}
