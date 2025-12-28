import {Component, Inject} from '@angular/core';
import {AppComponent} from '../../../../app.component';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {formatDate} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {createKartaRowerowa} from '../rejestr-kart-rowerowych/rejestr-kart-rowerowych.component';

interface SerialEditSchema {
  cards?: number[],
  data_wydania?: string | null,
  uwagi?: string,
  numer_karty?: string,
  czy_odebrana?: boolean,
  czy_dublikat?: boolean,
}

@Component({
  selector: 'app-bicycle-card-set-data-massive',
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './bicycle-card-set-data-massive.component.html',
})
export class BicycleCardSetDataMassiveComponent extends AppComponent {
  public createBicycleCardVar: createKartaRowerowa = {
    data_wydania: ''
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    cardsId: number[],
  }) {
    super();

    this.isProgress = true;
  }

  generatedAutomaticNumberCard(): void {
    this.createBicycleCardVar.numer_karty = '${nr}/${rok}';
  }

  updateBicycleCardFetch(): void {
    const headers = this.setHeaderAuthorization();

    const payload: SerialEditSchema = {
      cards: this.data.cardsId,
      data_wydania: this.createBicycleCardVar.data_wydania ? formatDate(this.createBicycleCardVar.data_wydania, 'yyyy-MM-dd', 'en-US') : null,
      numer_karty: this.createBicycleCardVar.numer_karty,
      czy_dublikat: this.createBicycleCardVar.czy_dublikat,
      czy_odebrana: this.createBicycleCardVar.czy_odebrana,
      uwagi: this.createBicycleCardVar.uwagi,
    };

    this.appHttp.patch<any>('/api/School/BicycleCard/', payload, {headers}).subscribe({
      next: () => {
        this.openSnackBar('Karty rowerowe zostały aktualizowane.', 'OK');
      },
      error: () => {
        this.openSnackBar('Wystąpił błąd, podczas edycji kart rowerowych.', 'OK');
      }
    });
  }
}
