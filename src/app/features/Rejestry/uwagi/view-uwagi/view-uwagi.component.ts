import {Component, ViewChild} from '@angular/core';
import {AppComponent} from '../../../../app.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {getWycieczki} from '../../../../shared/service/core/secretariat/wycieczki.service';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';
import {MatCard} from '@angular/material/card';
import {MatIconButton} from '@angular/material/button';
import {NgClass, NgIf} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {getNotes} from '../../../../shared/service/core/secretariat/student/notes.service';

@Component({
  selector: 'app-view-uwagi',
  imports: [
    LoadingHTMLComponent,
    MatCard,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatTooltip,
    NgIf,
    MatIcon,
    MatTooltip,
    MatHeaderCellDef,
    NgClass,
  ],
  templateUrl: './view-uwagi.component.html',
  styleUrl: './view-uwagi.component.css'
})
export class ViewUwagiComponent extends AppComponent {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'uczen',
    'oddzial',
    'rodzaj_text',
    'kategoria',
    'punkty',
    'tresc',
    'dodal',
    'dt'
  ];

  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    super();

    this.getNotesFetch();
  }

  async getNotesFetch() {
    this.isProgress = true;

    await getNotes()
    .then((response) => {
      this.dataSource.data = response;
    })
    .catch((err) => {
      this.openSnackBar('Wystąpił błąd, podczas ładowanie uwag.');
    })
    .finally(() => {
      this.isProgress = false;

      this.dataSource.sort = this.sort;
    });
  }
}
