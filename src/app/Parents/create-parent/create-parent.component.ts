import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from '../../app.component';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';

interface ParentCreate {
  user_name?: string,
  user_lastname?: string,
  id_uczen?: number,
  email?: string,
  plec?: number,
}

@Component({
  selector: 'app-create-parent',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    NgIf,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-parent.component.html',
  styleUrl: './create-parent.component.css'
})
export class CreateParentComponent extends AppComponent {
  parentsOptionsCreate: ParentCreate = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    studentId: number;
    user_name?: string,
    user_lastname?: string,
  }) {
    super();

    this.parentsOptionsCreate.user_name = data.user_name;
    this.parentsOptionsCreate.user_lastname = data.user_lastname
  }

  getCreateParentAccount(): void {
    if (!this.data.studentId) {
      this.openSnackBar('Nie udało się pobrać identyfikatora ucznia. Dodanie konta rodzica nie jest możliwe w tej chwili.', 'OK');

      return;
    }

    const headers = this.setHeaderAuthorization();

    this.appHttp.post<any>(`/api/School/Students/${this.data.studentId}/Parents`, this.parentsOptionsCreate, {headers}).subscribe({
      next: (data) => {
        this.openSnackBar('Rodzic został dodany dla ucznia.', 'OK');
      },
      error: (error) => {
        switch (error.error.error) {
          case 'User exists 2 parent account.':
            this.openSnackBar('Zostało dodane 2 konta dla tego ucznia. Więcej nie wolno dodawać.', 'OK');
            break;

          default:
            this.openSnackBar('Nie dodano rodzica dla ucznia. Wystąpił błąd.', 'OK');
        }
      }
    });
  }
}
