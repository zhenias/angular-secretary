import {Component, ViewChild} from '@angular/core';
import {AppComponent} from '../../../app.component';
import {LoadingHTMLComponent} from '../../../shared/components/loading-html/loading-html.component';
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
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {FormsModule} from '@angular/forms';
import { getParents, getParentsUpdateMassive } from '../../../shared/service/core/secretariat/parents/parent.service';

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
  public pageSize = 50;
  public totalItems = 1;

  public selectSort: 'all'|'parents_with_students'|'parents_with_not_students' = 'all';

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  displayedColumns: string[] = [
    'select',
    'actions',
    'gender',
    'full_user_name',
    'class',
    'year',
    'student',
    'is_active',
  ];

  constructor() {
    super();

    this.isProgress = true;

    this.getFetchParents();
  }

  async selectSortOnChange() {
    this.isProgress = true;

    await this.getFetchParents();
  }

  async getFetchParents() {
    await getParents(
      this.selectSort,
      this.currentPage,
      this.pageSize,
    )
    .then((response) => {
      this.parents_list = response.data;
      this.dataSource.data = this.parents_list;

      this.currentPage = response.current_page;
      this.totalPages = response.last_page;

      this.totalItems = response.total;
    })
    .catch(() => {
      this.openSnackBar('Błąd podczas pobieranie o opiekunach / rodzicach.', 'OK');
    })
    .finally(() => {
      this.isProgress = false;

      this.dataSource.sort = this.sort;
    });
  }

  async onPageChange(event: PageEvent) {
    this.isProgress = true;

    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;

    await this.getFetchParents();
  }

  async getMassiveActions(action: string) {
    if (this.selection.selected.length === 0) {
      this.openSnackBar('Nie zaznaczono żadnych opiekunów / rodziców.', 'OK');

      return;
    }

    this.isProgress = true;

    await getParentsUpdateMassive(
      action,
      {
        users: this.selection.selected,
      },
    )
    .then(async (response) => {
      this.selection.clear();

      this.openSnackBar(this.selection.selected.length == 1 ? 'Zmiany został zapisany dla tego rodzica / opiekuna.' : 'Zmiany zostały zapisane, dla zaznaczonych rodziców / opiekunów.', 'OK');

      this.getCheckErrorForMassive(response, action, 'parent');

      await this.getFetchParents();
    })
    .catch((response) => {
      this.getCheckErrorForMassive(response.error, action, 'parent');

      this.openSnackBar('Nie udało się zmienić/dodać danych seryjnie dla zaznaczonych rodziców / opiekunów.', 'OK');
    })
    .finally(() => {
      this.isProgress = false;
    });

    // this.appHttp.post<any>(`/api/School/Students/Update/${action}`, {users: this.selection.selected}, {headers}).subscribe({
    //   next: async (data) => {
    //     this.selection.clear();

    //     this.openSnackBar(this.selection.selected.length == 1 ? 'Zmiany został zapisany dla tego rodzica / opiekuna.' : 'Zmiany zostały zapisane, dla zaznaczonych rodziców / opiekunów.', 'OK');

    //     this.getCheckErrorForMassive(data, action, 'parent');

    //     await this.getFetchParents();
    //   },
    //   error: () => {
    //     this.isProgress = false;

    //   }
    // });
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
}
