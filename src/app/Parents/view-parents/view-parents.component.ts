import {Component, ViewChild} from '@angular/core';
import {AppComponent} from '../../app.component';
import {LoadingHTMLComponent} from '../../loading-html/loading-html.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {FormsModule} from '@angular/forms';

interface SortParents {
  name: string,
  value: string,
}

interface ParentsList {
  id?: number,
  user_name?: string,
  user_lastname?: string,
  full_user_name: string,
  login?: string,
  student?: any,
  is_parent?: boolean,
  is_student?: boolean,
  gender?: string,
}

@Component({
  selector: 'app-view-parents',
  standalone: true,
  imports: [
    LoadingHTMLComponent,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    NgIf,
    NgClass,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    FormsModule,
  ],
  templateUrl: './view-parents.component.html',
  styleUrl: './view-parents.component.css'
})
export class ViewParentsComponent extends AppComponent {
  public parents_list: ParentsList[] = [];
  public sortParents: SortParents[] = [
    {
      name: 'Wszyscy rodzice / opiekunowie',
      value: 'all',
    },
    {
      name: 'Opiekunowie powiązani z uczniami',
      value: 'parents_with_students',
    },
    {
      name: 'Opiekunowie nie powiązani z uczniami',
      value: 'parents_with_not_students',
    },
  ];

  dataSource = new MatTableDataSource<any>(this.parents_list);

  public currentPage = 1;
  public totalPages = 0;
  public pageSize = 15;
  public totalItems = 1;

  public selectSort: string = 'all';

  selectSortOnChange() {
    this.isProgress = true;

    this.getFetchParents();
  }

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  displayedColumns: string[] = [
    'select',
    'actions',
    'gender',
    'full_user_name',
    'class',
    'student',
    'is_active',
  ];

  constructor() {
    super();

    this.isProgress = true;

    this.getFetchParents();
  }

  getFetchParents() {
    const headers = this.setHeaderAuthorization();

    this.appHttp.get<any>(`/api/School/Parents/${this.selectSort}?page=${this.currentPage}&per_page=${this.pageSize}`, {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.parents_list = data.data;
        this.dataSource.data = this.parents_list;

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

    this.getFetchParents();
  }

  getMassiveActions(action: string) {
    if (this.selection.selected.length === 0) {
      this.openSnackBar('Nie zaznaczono żadnych rodziców / opiekunów.', 'OK');

      return;
    }

    this.isProgress = true;

    const headers = this.setHeaderAuthorization();

    this.appHttp.post<any>(`/api/School/Students/Update/${action}`, {users: this.selection.selected}, {headers}).subscribe({
      next: (data) => {
        this.selection.clear();

        this.openSnackBar(this.selection.selected.length == 1 ? 'Zmiany został zapisany dla tego rodzica / opiekuna.' : 'Zmiany zostały zapisane, dla zaznaczonych rodziców / opiekunów.', 'OK');

        this.getCheckErrorForMassive(data, action, 'parent');

        this.getFetchParents();
      },
      error: () => {
        this.isProgress = false;

        this.openSnackBar('Nie udało się zmienić/dodać danych seryjnie dla zaznaczonych rodziców / opiekunów.', 'OK');
      }
    });
  }

  sortData(sort: Sort) {
    const data = this.parents_list.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'full_user_name':
          return this.compare(a?.full_user_name, b?.full_user_name, isAsc);
        case 'class':
          return this.compare(a?.student?.class?.class || '', b?.student?.class?.class || '', isAsc);
        case 'student':
          return this.compare(a?.student?.full_user_name, b?.student?.full_user_name, isAsc);
        default:
          return 0;
      }
    });
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
