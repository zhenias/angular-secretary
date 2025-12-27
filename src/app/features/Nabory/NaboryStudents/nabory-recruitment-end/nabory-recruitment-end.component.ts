import {Component} from '@angular/core';
import {AppComponent} from '../../../../app.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {formatDate, NgForOf, NgIf} from '@angular/common';
import {createNaboryEndInterface, postNaboryEnd} from '../../../../shared/service/core/secretariat/nabory/recruitmentEnd';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {getNaboryClasses, responseNaboryClassesInterface} from '../../../../shared/service/core/secretariat/nabory/classes';
import {getTeachers} from '../../../../shared/service/core/secretariat/teachers';
import {MatSelectModule} from '@angular/material/select';
import responseTeachersInterface from '../../../../shared/service/core/secretariat/teachers';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';

@Component({
  selector: 'app-nabory-recruitment-end',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    NgIf,
    MatCheckboxModule,
    NgForOf,
    MatSelectModule,
    LoadingHTMLComponent
  ],
  templateUrl: './nabory-recruitment-end.component.html',
  standalone: true
})
export class NaboryRecruitmentEndComponent extends AppComponent {
  public buildFetch: createNaboryEndInterface = {
    year_school: 0,
    classes: [],
    start_year: '',
    end_year: '',
    date_admission: '',
    enabled_usprawiedliwienia: false
  };

  public getClassesList: responseNaboryClassesInterface[] = [];
  public getTeachersList: responseTeachersInterface[] = [];

  constructor() {
    super();

    this.isProgress = true;

    this.getClassesFetch();
    this.getTeachersFetch();
  }

  public writeSchoolYear(): void {
    const year: string = formatDate(
      this.buildFetch.date_admission,
      'Y',
      'en_US',
    );

    const dateNormal = formatDate(
      this.buildFetch.date_admission,
      'Y-MM-dd',
      'en_US'
    );

    this.buildFetch.year_school = Number(year);
    this.buildFetch.start_year  = dateNormal;
  }

  async recruitmentEndFetch(): Promise<void> {
    try {
      this.buildFetch = {
        ...this.buildFetch,
        start_year: formatDate(
          this.buildFetch.start_year,
          'Y-MM-dd',
          'en_US'
        ),
        end_year: formatDate(
          this.buildFetch.end_year,
          'Y-MM-dd',
          'en_US'
        ),
        date_admission: formatDate(
          this.buildFetch.date_admission,
          'Y-MM-dd',
          'en_US'
        )
      }

      const response = await postNaboryEnd(
        this.buildFetch
      );

      if ('errors' in response && response?.errors) {
        this.openSnackBar(
          'Formularz niekompletny.',
          'OK'
        );

        return;
      }

      this.openSnackBar(
        'Nabór został zakończony. Oddziały z uczniami są już w systemie.',
        'OK'
      );
    } catch (e) {
      this.openSnackBar(
        'Wystąpił błąd, podczas zakończenia naboru.',
        'OK'
      );
    }
  }

  async getClassesFetch(): Promise<void> {
    this.isProgress = true;

    this.getClassesList = await getNaboryClasses().finally(() => {
      this.isProgress = false;
    });
  }

  async getTeachersFetch(): Promise<void> {
    this.getTeachersList = (await getTeachers(100, 1)).data;
  }

  public assignTeacher(classId: number, ownerId: number): void {
    const index = this.buildFetch.classes.findIndex(c => c.classId === classId);

    if (index > -1) {
      this.buildFetch.classes[index].ownerId = ownerId;
    } else {
      this.buildFetch.classes.push({ classId, ownerId });
    }
  }
}
