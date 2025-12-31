import {Component, Inject} from '@angular/core';
import {AppComponent} from '../../../app.component';
import {HttpClient} from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {formatDate, NgForOf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

interface DataAddToClass {
  class: number,
  date: string,
}

@Component({
  selector: 'app-add-students-massive-to-class',
  standalone: true,
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
    FormsModule,
    MatNativeDateModule,
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './add-students-massive-to-class.component.html',
})
export class AddStudentsMassiveToClassComponent extends AppComponent {
  public classes: any[] = [];
  protected dataAddToClass: DataAddToClass = {
    class: 0,
    date: ''
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    studentsId: number[];
  }, private http: HttpClient) {
    super();

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

  public addStudentsToClass(): void {
    const headers = this.setHeaderAuthorization();

    this.http.post<any>(`/api/School/Students/Update/add_class`, {
      users: this.data.studentsId,
      class: this.dataAddToClass.class,
      date: formatDate(this.dataAddToClass.date, 'Y-MM-dd', 'en')
    }, {headers}).subscribe({
      next: (data) => {
        this.openSnackBar(this.data.studentsId.length == 1 ? 'Kandydat został dodany.' : 'Kandydaci zostali dodani do oddziału.', 'OK');
      },
      error: () => {
        this.isProgress = false;

        this.openSnackBar('Nie udało się dodać kandydatów do oddziału.', 'OK');
      }
    });
  }
}
