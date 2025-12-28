import {AfterViewInit, Component, Inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatInput, MatSuffix} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";
import {AppComponent} from '../../../../app.component';
import responseTeachersInterface, {getTeachers} from '../../../../shared/service/core/secretariat/teachers';
import {
  editClass,
  EditClassTypes,
  getClass,
  getClassesInterface
} from '../../../../shared/service/core/secretariat/classes';
import {MatOption, MatSelect} from '@angular/material/select';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {DialogRef} from '@angular/cdk/dialog';

@Component({
  selector: 'app-edit-class',
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
    NgIf,
    LoadingHTMLComponent,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix
  ],
  templateUrl: './edit-class.component.html',
})
export class EditClassComponent extends AppComponent implements AfterViewInit {
  public getTeachersList: responseTeachersInterface[] = [];
  public editClassBuild: EditClassTypes = {
    date_end: '',
    date_start: '',
    is_active_eusprawiedliwienia: false,
    kod: '',
    name_class: '',
    odzial: 0,
    teacher: 0,
  };
  public getClass: getClassesInterface | undefined = {
    class: '',
    date_end: '',
    date_start: '',
    description: '',
    id: 0,
    is_active_eusprawiedliwienia: false,
    is_oo: 0,
    level: 0,
    symbol: '',
    teacher: '',
    teacher_id: 0,
    unit: undefined,
    year: '',
    year_one: 0
  };

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data:
    {
      classId: number,
    },
    public dialogRef: DialogRef
  ) {
    super();
  }

  ngAfterViewInit() {
    this.getTeachersFetch();
    this.getClassFetch();
  }

  async getTeachersFetch(): Promise<void> {
    this.getTeachersList = (await getTeachers(100, 1)).data;
  }

  async getClassFetch(): Promise<void> {
    this.isProgress = true;

    const classes = await getClass(this.data.classId).finally(() => { this.isProgress = false; });
    this.getClass = classes;

    if (classes?.error) {
      this.openSnackBar('Nie znaleziono oddziału.');
      this.dialogRef.close();
      return;
    }

    this.editClassBuild = {
      date_end: classes.date_end,
      is_active_eusprawiedliwienia: classes.is_active_eusprawiedliwienia,
      name_class: classes.description,
      teacher: classes.teacher_id,
      date_start: classes.date_start,
      kod: classes.symbol,
      odzial: classes.level
    };
  }

  private formatDate(date: Date | string | null | undefined): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Y-m-d
  }

  async updateClassFetch() {
    try {
      const payload = {
        ...this.editClassBuild,
        date_start: this.formatDate(this.editClassBuild.date_start),
        date_end: this.formatDate(this.editClassBuild.date_end),
      };

      const response = await editClass(
        this.data.classId,
        payload
      );

      if (response?.errors) {
        const description = Object.values(response.errors)
          .flat()
          .map(err => `• ${err}`)
          .join('<br>');

        this.showErrorBox(
          'Błędy podczas edycji oddziału.',
          description
        );

        return;
      }

      this.openSnackBar('Dane w oddziale zostały aktualizowane.');
    } catch (e) {
      this.openSnackBar('Wystąpił błąd, podczas edycji oddziału.');
    }
  }
}
