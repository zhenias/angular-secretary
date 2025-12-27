import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../../../app.component';
import { OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-usun-ucznia-zklasy',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
  ],
  templateUrl: './usun-ucznia-zklasy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsunUczniaZKlasyComponent extends AppComponent {
  protected studentInClass: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { class: any; student: any }, private http: HttpClient, private route: ActivatedRoute) {
    super();
  }

  public usunUczniaZKlasy(classId: number): void {
    const headers = this.setHeaderAuthorization();

    const userId = this.data.student.id;

    this.http.delete<any[]>(`/api/School/Students/${userId}/StateSchool/${classId}`, { headers }).subscribe({
      next: (data) => {
        this.studentInClass = data;
      },
      error: (error) => {
        this.openSnackBar('Wystąpił błąd, podczas usunięcia ucznia z oddziału.', 'OK');
      }
    });
  }
}
