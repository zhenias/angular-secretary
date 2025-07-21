import {Component, ViewChild} from '@angular/core';
import {AppComponent} from '../../../app.component';
import {HttpClient} from '@angular/common/http';
import {NgClass, NgIf} from '@angular/common';
import {LoadingHTMLComponent} from "../../../loading-html/loading-html.component";
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-teachers-list',
  imports: [
    NgIf,
    LoadingHTMLComponent,
    MatCardModule,
    MatChipsModule,
    NgClass,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './teachers-list.component.html',
  styleUrl: './teachers-list.component.css'
})
export class TeachersListComponent extends AppComponent {
  public teachers: any[] = [];
  public currentPage = 1;
  public totalPages = 0;
  public pageSize = 15;
  public nextPageUrl: string | null = null;
  public prevPageUrl: string | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  displayedColumns: string[] = [
    'select',
    'actions',
    'full_user_name',
    'login',
    'email',
    'pesel',
    'data_urodzenia',
    'data_rejestracji',
    'permissions',
    'is_active',
  ];
  dataSource = new MatTableDataSource<any>(this.teachers);

  totalItems: number = 1;

  constructor(private http: HttpClient) {
    super();

    this.isProgress = true;

    this.getTeachers();
  }

  private getTeachers() {
    const headers = this.setHeaderAuthorization();

    this.http.get<any>('/api/School/Teachers', {headers}).subscribe({
      next: (data: any) => {
        this.isProgress = false;

        this.teachers = data.data;
        this.dataSource.data = this.teachers;

        this.currentPage = data.current_page;
        this.totalPages = data.last_page;

        this.totalItems = data.total;
      },
      error: (error) => {
        this.isProgress = false;

        this.openSnackBar('Błąd pobierania danych pracowników.', 'OK');
      }
    });
  }

  async onPageChange(event: PageEvent) {
    this.isProgress = true;

    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;

    this.getTeachers();
  }

  sortData(sort: Sort) {
    const data = this.teachers.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'full_user_name':
          return this.compare(a.full_user_name, b.full_user_name, isAsc);
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        case 'pesel':
          return this.compare(a.pesel, b.pesel, isAsc);
        case 'data_urodzenia':
          return this.compare(new Date(a.data_urodzenia).getTime(), new Date(b.data_urodzenia).getTime(), isAsc);
        case 'is_active':
          return this.compare(a.is_active, b.is_active, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number, b: number, isAsc: boolean) {
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
