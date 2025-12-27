import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {AppComponent} from '../../../app.component';
import {FormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-skresl-ucznia-zklasy',
  imports: [
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './skresl-ucznia-zklasy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkreslUczniaZKlasyComponent extends AppComponent {
  protected studentInClass: any;
  public data_skreslenia: string = '';
  public powod: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    class: any;
    student: any
  }, private http: HttpClient, private route: ActivatedRoute) {
    super();
  }

  public skresl(classId: number): void {
    const headers = this.setHeaderAuthorization();

    const userId = this.data.student.id;

    this.http.patch<any[]>(`/api/School/Students/${userId}/StateSchool/${classId}`, {
      powod_skreslenia: this.powod,
      data_skreslenia: formatDate(this.data_skreslenia, 'Y-MM-dd', 'en'),
      is_skreslony: true,
    }, {headers}).subscribe({
      next: (data) => {
        this.studentInClass = data;
      },
      error: (error) => {

        switch (error.error.error) {
          case 'The student is removed from the class.':
            this.openSnackBar('Uczeń już został skreślony z oddziału. Data skreślenia: ' + error.error.date ? error.error.date : '[brak daty]...', 'OK');
            break;
          default:
            this.openSnackBar('Wystąpił błąd, podczas skreślenia ucznia z oddziału.', 'OK');
        }
      }
    });
  }
}
