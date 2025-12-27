import {Component, Inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {formatDate, NgForOf, NgIf} from "@angular/common";
import {MatInputModule} from '@angular/material/input';
import {AppComponent} from '../../../../app.component';
import {createKartaRowerowa} from '../rejestr-kart-rowerowych/rejestr-kart-rowerowych.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-bicycle-card-create',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    NgIf,
  ],
  templateUrl: './bicycle-card-create.component.html',
})
export class BicycleCardCreateComponent extends AppComponent {
  public classes: any = [];
  public students: any = [];
  public createBicycleCardVar: createKartaRowerowa = {
    data_wydania: ''
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    count: number,
    studentId?: number,
    classId?: number,
  }) {
    super();

    if (data.studentId) {
      this.createBicycleCardVar.student_id = data.studentId;
    }

    if (data.classId) {
      this.createBicycleCardVar.id_class = data.classId;

      this.getStudents();
    }

    if (!data.count) {
      this.getFetchBicycleCards();
    }

    this.getClasses();
  }

  getFetchBicycleCards() {
    this.isProgress = true;

    const headers = this.setHeaderAuthorization();

    this.appHttp.get<any>(`/api/School/BicycleCard`, {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;
        this.data.count = data.total;
      },
      error: () => {
        this.isProgress = false;

        this.openSnackBar('Błąd podczas pobieranie danych.', 'OK');
      }
    });
  }

  generatedAutomaticNumberCard(): void {
    this.createBicycleCardVar.numer_karty = ((this.data.count + 1) + '/' + formatDate((new Date()), 'yyyy', 'en-US'));
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

    this.appHttp.get<any>('/api/School/Classes/' + this.createBicycleCardVar.id_class + '/Students', {headers}).subscribe({
      next: (data) => {
        this.students = data.students;
      },
    });
  }

  createBicycleCardFetch() {
    const headers = this.setHeaderAuthorization();

    const payload = {
      ...this.createBicycleCardVar,
      data_wydania: this.createBicycleCardVar.data_wydania ? formatDate(this.createBicycleCardVar.data_wydania, 'yyyy-MM-dd', 'en-US') : null,
    };

    this.appHttp.post<any>('/api/School/BicycleCard', payload, {headers}).subscribe({
      next: () => {
        this.openSnackBar('Karta rowerowa została dodana dla ucznia.', 'OK');
      },
      error: () => {
        this.openSnackBar('Wystąpił błąd, podczas dodawania karty rowerowej.', 'OK');
      }
    });
  }
}
