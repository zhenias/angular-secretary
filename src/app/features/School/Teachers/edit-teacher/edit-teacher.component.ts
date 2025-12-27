import {Component, Inject} from '@angular/core';
import {AppComponent} from '../../../../app.component';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {formatDate, NgClass, NgIf} from '@angular/common';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';
import responseTeachersInterface, {
  getTeacher,
  TeacherEditInterface,
  updateTeacher
} from '../../../../shared/service/core/secretariat/teachers';

@Component({
  selector: 'app-edit-teacher',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTooltipModule,
    NgIf,
    LoadingHTMLComponent,
    NgClass,
  ],
  templateUrl: './edit-teacher.component.html',
})
export class EditTeacherComponent extends AppComponent {
  public getTeacher: responseTeachersInterface = {
    id: 0,
    user_name: '',
    user_lastname: '',
    full_user_name: '',
    email: '',
    login: '',
    pesel: 0,
    data_urodzenia: '',
    data_rejestracji: '',
    permissions: '',
    is_active: 0,
    plec: 0,
    is_admin: 0,
    is_pedagogue: 0,
    is_teacher: 0,
    is_director: 0,
    is_secretary: 0,
    is_replacements: 0,
    is_parent: false,
    is_student: false,
    alias: '',
    numer_telefonu: '',
    gender: ''
  };
  public editTeacherVar: TeacherEditInterface = {};

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { userId: number }
  ) {
    super();

    this.isProgress = true;
    this.getTeacherFetch();
  }

  async getTeacherFetch(): Promise<void> {
    try {
      const response = await getTeacher(
        this.data.userId
      );

      this.isProgress = false;

      this.getTeacher = response;
    } catch (e) {
      this.openSnackBar('Błąd podczas pobierania informacji o pracowniku.', 'OK');
    }
  }

  async saveTeacher(): Promise<void> {
    this.isProgress = true;

    this.editTeacherVar = {
      user_name: this.getTeacher.user_name,
      user_lastname: this.getTeacher.user_lastname,
      email: this.getTeacher.email,
      pesel: this.getTeacher.pesel,
      data_urodzin: formatDate(this.getTeacher.data_urodzenia, 'Y-MM-dd', 'en_US'),
      plec: this.getTeacher.plec,
      is_admin: this.getTeacher.is_admin ? 1 : 0,
      is_director: this.getTeacher.is_director ? 1 : 0,
      is_pedagog: this.getTeacher.is_pedagogue ? 1 : 0,
      is_sekretarz: this.getTeacher.is_secretary ? 1 : 0,
      is_zastepstwa: this.getTeacher.is_replacements ? 1 : 0,
      is_nauczyciel: this.getTeacher.is_teacher ? 1 : 0,
      is_active: this.getTeacher.is_active ? 1 : 0,
    };

    try {
      const response = await updateTeacher(
        this.data.userId,
        this.editTeacherVar
      );

      this.isProgress = false;

      this.getTeacher = response;
      this.openSnackBar('Dane pracownika zostały zapisane.', 'OK');
    } catch (e) {
      this.openSnackBar('Błąd podczas edytowania pracownika.', 'OK');
    }
  }
}
