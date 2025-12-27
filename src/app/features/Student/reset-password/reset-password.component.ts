import {HttpClient} from '@angular/common/http';
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from '../../../app.component';
import {LoadingHTMLComponent} from '../../../shared/components/loading-html/loading-html.component';

@Component({
  selector: 'app-reset-password',
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    LoadingHTMLComponent
  ],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent extends AppComponent {
  password: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { userId: number, user_name: string }, private http: HttpClient) {
    super();
  }

  getResetPasswordFetch(): void {
    if (this.password) {
      this.openSnackBar('Hasło zostało już zresetowane.', 'OK');

      return;
    }

    this.isProgress = true;

    const headers = this.setHeaderAuthorization();
    const userId = this.data.userId;

    this.http.post<any>(`/api/School/Students/${userId}/ResetPassword`, {}, {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.password = data.password;
      },
      error: (error) => {
        this.isProgress = false;

        this.openSnackBar('Nie udało się zresetować hasła.', 'OK');
      }
    })
  }
}
