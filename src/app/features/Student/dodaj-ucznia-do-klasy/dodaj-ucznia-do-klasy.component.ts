import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../../../app.component';
import {formatDate, NgFor} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

interface DataAddToClass {
  class: number,
  w_klasie_od: string,
};

@Component({
  selector: 'app-dodaj-ucznia-do-klasy',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    NgFor,
  ],
  templateUrl: './dodaj-ucznia-do-klasy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DodajUczniaDoKlasyComponent extends AppComponent {
  public classes: any[] = [];
  protected dataAddToClass: DataAddToClass = {
    class: 0,
    w_klasie_od: '',
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    class: string;
    student: any
  }, private http: HttpClient, private route: ActivatedRoute) {
    super();

    this.isProgress = true;

    this.getClasses();
  }

  private getClasses(): void {
    const headers = this.setHeaderAuthorization();

    this.http.get<any[]>('/api/School/Classes', {headers}).subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: (error) => {
        this.openSnackBar('Błąd pobierania danych o oddziałach.', 'OK');
      }
    });
  }

  protected dodajPobytUcznia(): void {
    const headers = this.setHeaderAuthorization();

    const userId = this.data.student.id;
    const actualDateFromNg = this.dataAddToClass.w_klasie_od;
    this.dataAddToClass.w_klasie_od = formatDate(actualDateFromNg, 'Y-MM-dd', 'en');

    this.http.post<any[]>('/api/School/Students/' + userId + '/StateSchool', this.dataAddToClass, {headers}).subscribe({
      next: (data) => {
        this.openSnackBar('Uczeń został dodany do oddziału.', 'OK');
      },
      error: (error) => {
        switch (error.error.error) {
          case "The student attends a class.":
            this.openSnackBar('Uczeń uczęszcza już do oddziału. Nie można go dodać do innego oddziału.', 'OK');
            break;
          case "Oddział nie isnieje.":
            this.openSnackBar('Oddział nie isnieje.', 'OK');
            break;
          case "Student not added to class.":
            this.openSnackBar('Uczeń nie został dodany do oddziału. Z powodu nieoczekiwanego błędu serwera.', 'OK');
            break;
          default:
            this.openSnackBar('Wystąpił nieznany błąd, podczas dodanie ucznia do oddziału. Uczeń nie został dodany do oddziału.', 'OK');
        }
      }
    });
  }
}
