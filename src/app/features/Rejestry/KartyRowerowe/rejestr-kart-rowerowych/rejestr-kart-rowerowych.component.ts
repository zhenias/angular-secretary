import {Component, ViewChild} from '@angular/core';
import {AppComponent} from '../../../../app.component';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgIf} from '@angular/common';
import {BicycleCardCreateComponent} from '../bicycle-card-create/bicycle-card-create.component';
import {BicycleCardEditComponent} from '../bicycle-card-edit/bicycle-card-edit.component';
import {
  BicycleCardSetDataMassiveComponent
} from '../bicycle-card-set-data-massive/bicycle-card-set-data-massive.component';

export interface getKartaRowerowa {
  id?: number,
  user?: string,
  student?: string,
  numer_karty?: string,
  class?: string,
  data_wydania?: string,
  uwagi?: string,
  czy_odebrana?: boolean,
  czy_dublikat?: boolean,
  created_at?: string,
  updated_at?: string,
}

export interface createKartaRowerowa {
  id?: number,
  student_id?: number,
  id_class?: number,
  numer_karty?: string, // max - 25
  czy_odebrana?: boolean,
  czy_dublikat?: boolean,
  uwagi?: string, // max - 255
  data_wydania: string, // date
}

@Component({
  selector: 'app-rejestr-kart-rowerowych',
  imports: [
    LoadingHTMLComponent,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    NgIf
  ],
  templateUrl: './rejestr-kart-rowerowych.component.html',
})
export class RejestrKartRowerowychComponent extends AppComponent {
  public getBicycleCards: getKartaRowerowa[] = [];

  dataSource = new MatTableDataSource<any>(this.getBicycleCards);

  public currentPage = 1;
  public totalPages = 0;
  public pageSize = 50;
  public totalItems = 1;

  public selectSort: string = 'all';

  displayedColumns: string[] = [
    'select',
    'actions',
    'student',
    'user',
    'numer_karty',
    'data_wydania',
    'uwagi',
    'classes',
    'czy_odebrano',
    'czy_dublikat',
    'created_at'
  ];

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  constructor() {
    super();

    this.isProgress = true;

    this.getFetchBicycleCards();
  }

  selectSortOnChange() {
    this.isProgress = true;

    this.getFetchBicycleCards();
  }

  getFetchBicycleCards() {
    const headers = this.setHeaderAuthorization();

    this.appHttp.get<any>(`/api/School/BicycleCard?page=${this.currentPage}&per_page=${this.pageSize}`, {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.getBicycleCards = data.data;
        this.dataSource.data = this.getBicycleCards;

        this.currentPage = data.current_page;
        this.totalPages = data.last_page;

        this.totalItems = data.total;
      },
      error: () => {
        this.isProgress = false;

        this.openSnackBar('Błąd podczas pobieranie danych.', 'OK');
      }
    });
  }

  async onPageChange(event: PageEvent) {
    this.isProgress = true;

    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;

    this.getFetchBicycleCards();
  }

  sortData(sort: Sort) {
    const data = this.getBicycleCards.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'data_wydania':
          return this.compare(a?.data_wydania, b?.data_wydania, isAsc);
        case 'class':
          return this.compare(a?.class || '', b?.class || '', isAsc);
        case 'student':
          return this.compare(a?.student, b?.student, isAsc);
        case 'numer_karty':
          return this.compare(a?.numer_karty, b?.numer_karty, isAsc);
        case 'user':
          return this.compare(a?.user, b?.user, isAsc);
        case 'classes':
          return this.compare(a?.class, b?.class, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string | null | undefined, b: number | string | null | undefined, isAsc: boolean) {
    if (a == null && b == null) return 0;
    if (a == null) return isAsc ? -1 : 1;
    if (b == null) return isAsc ? 1 : -1;

    if (typeof a === 'string' && typeof b === 'string') {
      return (a.localeCompare(b)) * (isAsc ? 1 : -1);
    }

    return ((a < b ? -1 : (a > b ? 1 : 0)) * (isAsc ? 1 : -1));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows && numRows > 0;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row.id));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'Odznacz' : 'Zaznacz'} wszystkie`;
    }
    return `${this.selection.isSelected(row.id) ? 'Odznacz' : 'Zaznacz'} wiersz`;
  }

  bicycleCardCreate() {
    const dialog = this.matDialog.open(BicycleCardCreateComponent, {
      width: '600px',
      height: '600px',
      disableClose: true,
      data: {
        count: this.totalItems,
      }
    });

    dialog.afterClosed().subscribe(result => {
      this.isProgress = true;

      this.getFetchBicycleCards();
    });
  }

  bicycleCardEdit(cardId: number) {
    const dialog = this.matDialog.open(BicycleCardEditComponent, {
      width: '600px',
      height: '600px',
      data: {
        cardId,
      }
    });

    dialog.afterClosed().subscribe(result => {
      this.isProgress = true;

      this.getFetchBicycleCards();
    });
  }

  bicycleCardMassiveUpdate(): void {
    const dialog = this.matDialog.open(BicycleCardSetDataMassiveComponent, {
      width: '600px',
      height: '600px',
      data: {
        cardsId: this.selection.selected,
      }
    });

    dialog.afterClosed().subscribe(result => {
      this.isProgress = true;

      this.getFetchBicycleCards();
    });
  }
}
