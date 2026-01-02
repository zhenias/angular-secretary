import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoadingHTMLComponent} from '../../../shared/components/loading-html/loading-html.component';
import {MatCardModule} from '@angular/material/card';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {AppComponent} from '../../../app.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatChipsModule} from '@angular/material/chips';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {classes, getClassesInterface} from '../../../shared/service/core/secretariat/classes';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    LoadingHTMLComponent,
    MatCardModule,
    NgIf,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    NgClass,
    MatTooltipModule,
    FormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
  ],
  templateUrl: './students.component.html',
})
export class StudentsComponent extends AppComponent implements AfterViewInit {
  public students: any[] = [];
  public currentPage = 1;
  public totalPages = 0;
  public pageSize = 50;
  public classId: number = 0;

  public getClassesList: getClassesInterface[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  displayedColumns: string[] = [
    'select',
    'actions',
    'plec',
    'full_user_name',
    'oddzial',
    'data_urodzenia',
    'pesel',
    'email',
    'numer_telefonu',
    'adres_zamieszkania',
    'adres_zameldowania',
    'is_active',
  ];
  dataSource = new MatTableDataSource<any>();

  totalItems: number = 1;

  constructor(private http: HttpClient) {
    super();

    this.getStudents();
    this.getClassesListFetch();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  async getStudents() {
    this.isProgress = true;

    const headers = this.setHeaderAuthorization();

    this.http.get<any>(
      `/api/School/Classes/StudentInClass?page=${this.currentPage}&per_page=${this.pageSize}&classId=${this.classId}`,
      {headers}
    ).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.students = data.data;
        this.dataSource.data = this.students;

        this.currentPage = data.current_page;
        this.totalPages = data.last_page;

        this.totalItems = data.total;

        setTimeout(() => this.dataSource.sort = this.sort);
      },
      error: () => {
        this.isProgress = false;

        this.openSnackBar('Błąd podczas pobieranie danych.', 'OK');
      }
    });

    setTimeout(() => this.dataSource.sort = this.sort);
  }

  public async getMassiveActions(action: string) {
    if (this.selection.selected.length === 0) {
      this.openSnackBar('Nie zaznaczono żadnych uczniów.', 'OK');

      return;
    }

    this.isProgress = true;

    const headers = this.setHeaderAuthorization();

    this.http.post<any>(`/api/School/Students/Update/${action}`, {users: this.selection.selected}, {headers}).subscribe({
      next: (data) => {
        this.selection.clear();

        this.openSnackBar(this.selection.selected.length == 1 ? 'Zmiany został zapisany dla tego ucznia.' : 'Zmiany zostały zapisane, dla zaznaczonych uczniów.', 'OK');

        this.getStudents();
      },
      error: () => {
        this.isProgress = false;

        this.openSnackBar('Nie udało się zmienić/dodać danych seryjnie dla zaznaczonych kandydatów.', 'OK');
      }
    });
  }

  async onPageChange(event: PageEvent) {
    this.isProgress = true;

    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;

    this.getStudents();
  }

  sortData(sort: Sort) {
    const data = this.students.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'full_user_name':
          return this.compare(a.full_user_name, b.full_user_name, isAsc);
        case 'oddzial':
          return this.compare(a.class.class, b.class.class, isAsc);
        case 'przyjety':
          return this.compare(a.w_klasie_od, b.w_klasie_od, isAsc);
        case 'rok_szkolny':
          return this.compare(a.class.year, b.class.year, isAsc);
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        case 'pesel':
          return this.compare(a.pesel, b.pesel, isAsc);
        case 'data_urodzenia':
          return this.compare(new Date(a.data_urodzenia).getTime(), new Date(b.data_urodzenia).getTime(), isAsc);
        case 'adres_zamieszkania':
          return this.compare(a.adres_zamieszkania, b.adres_zamieszkania, isAsc);
        case 'is_active':
          return this.compare(a.user.is_active, b.user.is_active, isAsc);
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

  async getClassesListFetch(): Promise<void> {
    this.isProgress = true;

    try {
      this.getClassesList = await classes().finally(() => {
        this.isProgress = false;
      });
    } catch (e) {
      this.isProgress = false;
    }
  }
}
