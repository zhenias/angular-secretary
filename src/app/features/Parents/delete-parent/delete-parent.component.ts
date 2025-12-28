import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {AppComponent} from '../../../app.component';

@Component({
  selector: 'app-delete-parent',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './delete-parent.component.html',
})
export class DeleteParentComponent extends AppComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    studentId: number;
    parentId: number,
    parent_user_name: string,
  }) {
    super();
  }

  getDeleteParent(): void {
    if (!this.data.studentId) {
      this.openSnackBar('Nie udało się pobrać identyfikatora ucznia. Usunięcie konta rodzica nie jest możliwe w tej chwili.', 'OK');

      return;
    }

    const headers = this.setHeaderAuthorization();

    this.appHttp.delete<any>(`/api/School/Students/${this.data.studentId}/Parents/${this.data.parentId}`, {headers}).subscribe({
      next: (data) => {
        this.openSnackBar('Rodzic został rozłączony z uczniem oraz usunięty z systemu.', 'OK');
      },
      error: (error) => {
        this.openSnackBar('Nie rozłączono rodzica z uczniem.', 'OK');
      }
    });
  }
}
