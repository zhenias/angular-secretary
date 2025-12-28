import {AfterViewInit, Component} from '@angular/core';
import {MatInput} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {DialogRef} from '@angular/cdk/dialog';
import responseTeachersInterface, {getTeachers} from '../../../../shared/service/core/secretariat/teachers';
import {getUnits, UnitTypes} from '../../../../shared/service/core/secretariat/units';
import {NgForOf} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {createClass, CreateClassTypes} from '../../../../shared/service/core/secretariat/classes';
import {AppComponent} from '../../../../app.component';

@Component({
  selector: 'app-create-class',
  imports: [
    MatFormFieldModule,
    MatInput,
    MatSelectModule,
    MatOptionModule,
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    NgForOf,
    FormsModule
  ],
  templateUrl: './create-class.component.html',
  standalone: true,
})
export class CreateClassComponent extends AppComponent implements AfterViewInit {
  public getTeachersList: responseTeachersInterface[] = [];
  public getUnitsList: UnitTypes[] = [];
  public createClassBuild: CreateClassTypes = {
    jednostki: 0,
    kod: '',
    name_class: '',
    odzial: 1,
    rok_szkolny: new Date().getFullYear(),
    teacher: 0
  };

  constructor(private dialogRef: DialogRef) {
    super();
  }

  ngAfterViewInit() {
    this.getTeachersFetch();
    this.getUnitsFetch();
  }

  async getTeachersFetch(): Promise<void> {
    this.getTeachersList = (await getTeachers(100, 1)).data;
  }

  async getUnitsFetch() {
    this.getUnitsList = (await getUnits());
  }

  async createClassFetch() {
    try {
      const response = await createClass(
        this.createClassBuild
      );

      if (response?.errors) {
        const description = Object.values(response.errors)
          .flat()
          .map(err => `• ${err}`)
          .join('<br>');

        this.showErrorBox(
          'Błędy podczas tworzenia oddziału.',
          description
        );

        return;
      }

      this.openSnackBar('Oddział został dodany.');
      this.dialogRef.close();
    } catch (e) {
      this.openSnackBar('Wystąpił błąd, podczas dodawania oddziału.');
    }
  }
}
