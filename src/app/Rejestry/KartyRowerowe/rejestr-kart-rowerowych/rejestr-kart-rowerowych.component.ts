import {Component, ViewChild} from '@angular/core';
import {AppComponent} from '../../../app.component';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {LoadingHTMLComponent} from '../../../loading-html/loading-html.component';
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

interface getKartaRowerowa {
  id?: number,
  user?: string,
  student?: string,
  numer_karty?: string,
  class?: string,
  data_wydania?: string,
  uwagi?: string,
  czy_odebrana?: boolean,
  czy_dublikat?: boolean,
}

interface createKartaRowerowa {
  student_id?: number,
  id_class?: number,
  numer_karty?: string, // max - 25
  czy_odebrana?: boolean,
  czy_dublikat?: boolean,
  uwagi?: string, // max - 255
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
  styleUrl: './rejestr-kart-rowerowych.component.css'
})
export class RejestrKartRowerowychComponent extends AppComponent {
  public buildAddCardBicycle: createKartaRowerowa = {};
  public getBicycleCards: getKartaRowerowa[] = [];

  dataSource = new MatTableDataSource<any>(this.getBicycleCards);

  public currentPage = 1;
  public totalPages = 0;
  public pageSize = 15;
  public totalItems = 1;

  public selectSort: string = 'all';

  displayedColumns: string[] = [
    'select',
    'actions',
    'classes',
    'data_wydania',
    'student',
    'user',
    'czy_dublikat',
    'czy_odebrano'
  ];

  selectSortOnChange() {
    this.isProgress = true;

    this.getFetchBicycleCards();
  }

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  constructor() {
    super();

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

  createBicycleCard() {

  }

  async onPageChange(event: PageEvent) {
    this.isProgress = true;

    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;

    this.getFetchBicycleCards();
  }

  sortData(sort: Sort) {
    // const data = this.getBicycleCards.slice();
    // if (!sort.active || sort.direction === '') {
    //   this.dataSource.data = data;
    //   return;
    // }
    //
    // this.dataSource.data = data.sort((a, b) => {
    //   const isAsc = sort.direction === 'asc';
    //   switch (sort.active) {
    //     case 'data_wydania':
    //       return this.compare(a?.data_wydania, b?.data_wydania, isAsc);
    //     case 'class':
    //       return this.compare(a?.class || '', b?.class || '', isAsc);
    //     case 'student':
    //       return this.compare(a?.student?.full_user_name, b?.student?.full_user_name, isAsc);
    //     default:
    //       return 0;
    //   }
    // });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
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
}
