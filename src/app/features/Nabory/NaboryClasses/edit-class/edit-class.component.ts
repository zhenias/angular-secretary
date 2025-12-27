import {Component, Inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {
  createNaboryClassesInterface,
  deleteNaboryClass,
  getNaboryClass,
  updateNaboryClass
} from '../../../../shared/service/core/secretariat/nabory/classes';
import {getUnits} from '../../../../shared/service/core/secretariat/units';
import {UnitInterface} from '../../../Student/students.types';
import {AppComponent} from '../../../../app.component';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';

@Component({
  selector: 'app-edit-class',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    LoadingHTMLComponent,
    NgIf
  ],
  templateUrl: './edit-class.component.html',
  standalone: true
})
export class EditClassComponent extends AppComponent {
  public buildFetch: createNaboryClassesInterface = {
    level: 1,
    symbol: '',
    id_jednostka: 0
  };
  public unitsList: UnitInterface[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      classId: number
    }
  ) {
    super();

    this.isProgress = true;

    this.getUnitsList();
    this.getClass();
  }

  async getClass(): Promise<void> {
    try {
      this.buildFetch = await getNaboryClass(this.data.classId);

      this.isProgress = false;
    } catch (e) {
      this.isProgress = true;

      this.openSnackBar('Wystąpił błąd, podczas pobierania danych.', 'OK');
    }
  }

  async updateClass(): Promise<void> {
    try {
      const response = await updateNaboryClass(this.data.classId, this.buildFetch);

      if ('error' in response && response?.error == 'Class not found.') {
        this.openSnackBar('Nie znaleziono oddziału.', 'OK');

        return;
      }

      this.openSnackBar('Oddział został zaktualizowany.', 'OK');
    } catch (e) {
      this.openSnackBar('Wystąpił błąd, podczas aktualizowania oddziału.', 'OK');
    }
  }

  async deleteClass(): Promise<void> {
    try {
      const response = await deleteNaboryClass(this.data.classId);

      if (response?.error == 'Students exists in class.') {
        this.openSnackBar('W oddziale są uczniowie przypisani. Nie można go usunąć.', 'OK');

        return;
      }

      this.openSnackBar('Oddział został usunięty.', 'OK');
    } catch (e) {
      this.openSnackBar('Wystąpił błąd, podczas usuwania oddziału.', 'OK');
    }
  }

  async getUnitsList(): Promise<void> {
    try {
      this.unitsList = await getUnits();
    } catch (e) {
      this.openSnackBar('Wystąpił błąd, podczas pobierania jednostek.', 'OK');
    }
  }
}
