import {Component, Inject} from '@angular/core';
import {AppComponent} from '../../../../app.component';
import {createKartaRowerowa, getKartaRowerowa} from '../rejestr-kart-rowerowych/rejestr-kart-rowerowych.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {formatDate, NgIf} from '@angular/common';

@Component({
  selector: 'app-bicycle-card-edit',
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './bicycle-card-edit.component.html',
})
export class BicycleCardEditComponent extends AppComponent {
  public getBicycleCard: getKartaRowerowa = {};
  public cardId: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    cardId: number,
  }) {
    super();

    this.isProgress = true;

    this.cardId = data.cardId;

    this.getCard();
  }

  private getCard(): void {
    const headers = this.setHeaderAuthorization();

    this.appHttp.get<getKartaRowerowa>('/api/School/BicycleCard/' + this.cardId, {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.getBicycleCard = data;
      },
      error: () => {
        this.isProgress = false;

        this.openSnackBar('Brak informacji o karcie rowerowej.', 'OK');
      }
    });
  }

  saveBicycleCardFetch(): void {
    const headers = this.setHeaderAuthorization();

    const payload = {
      ...this.getBicycleCard,
      data_wydania: this.getBicycleCard.data_wydania ? formatDate(this.getBicycleCard.data_wydania, 'yyyy-MM-dd', 'en-US') : null,
    }

    this.appHttp.patch<getKartaRowerowa>('/api/School/BicycleCard/' + this.cardId, payload, {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.getBicycleCard = data;
      },
      error: () => {
        this.isProgress = false;

        this.openSnackBar('Błąd, podczas zapisywania karty rowerowej.', 'OK');
      }
    });
  }

  deleteBicycleCardFetch(): void {
    const headers = this.setHeaderAuthorization();

    this.appHttp.delete<getKartaRowerowa>('/api/School/BicycleCard/' + this.cardId, {headers}).subscribe({
      next: () => {
        this.isProgress = false;
      },
      error: () => {
        this.isProgress = false;

        this.openSnackBar('Błąd, podczas usuwania karty rowerowej.', 'OK');
      }
    });
  }
}
