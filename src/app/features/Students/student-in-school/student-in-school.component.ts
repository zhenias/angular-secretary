import {Component, inject, ViewChild} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NgClass, NgIf} from '@angular/common';
import {AppComponent} from '../../../app.component';
import {LoadingHTMLComponent} from '../../../shared/components/loading-html/loading-html.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CreateStudentComponent} from '../../Student/create-student/create-student.component';
import {MatIconModule} from '@angular/material/icon';
import {SelectionModel} from '@angular/cdk/collections';
import {MatMenuModule} from '@angular/material/menu';
import {
  AddStudentsMassiveToClassComponent
} from '../add-students-massive-to-class/add-students-massive-to-class.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

export interface ColumnProfile {
  name: string;
  visible: number;
  order: number;
  label?: string;
}

@Component({
  selector: 'app-student-in-school',
  templateUrl: './student-in-school.component.html',
  imports: [
    NgIf,
    LoadingHTMLComponent,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    NgClass,
    MatTooltipModule,
    FormsModule,
  ],
  standalone: true,
})
export class StudentInSchoolComponent extends AppComponent {
  public staraKsiegaUczniowInfo = false;

  students: any[] = [];
  pagination: any;
  currentPage = 1;

  totalPages = 0;
  pageSize = 50;

  @ViewChild(MatSort) sort!: MatSort;
  readonly dialog = inject(MatDialog);

  allColumns: ColumnProfile[] = [
    {name: 'select', visible: 1, order: 0, label: 'Zaznacz uczniów'},
    {name: 'actions', visible: 1, order: 1, label: 'Akcje'},
    {name: 'full_user_name', visible: 1, order: 2, label: 'Uczeń'},
    {name: 'gender', visible: 1, order: 2, label: 'Płeć'},
    {name: 'email', visible: 1, order: 3, label: 'Email'},
    {name: 'pesel', visible: 1, order: 4, label: 'Pesel'},
    {name: 'data_urodzenia', visible: 1, order: 5, label: 'Data urodzenia'},
    {name: 'adres_zamieszkania', visible: 1, order: 6, label: 'Adres zamieszkania'},
    {name: 'adres_zameldowania', visible: 1, order: 6, label: 'Adres zameldowania'},
    {name: 'numer_telefonu', visible: 1, order: 6, label: 'Numer telefonu'},
    {name: 'typ_nauczania', visible: 1, order: 7, label: 'Typ nauczania'},
    {name: 'data_rejestracji', visible: 1, order: 8, label: 'Data rejestracji'},
    {name: 'is_active', visible: 1, order: 9, label: 'Zablokowany'},
  ];

  get displayedColumns(): string[] {
    return this.allColumns
      .filter(c => c.visible)
      .sort((a, b) => a.order - b.order)
      .map(c => c.name);
  }

  dataSource = new MatTableDataSource<any>(this.students);
  selection = new SelectionModel<number>(true, []);
  totalItems: number = 1;

  constructor(private http: HttpClient) {
    super();

    this.isProgress = true;

    this.getStudents();
  }

  createStudentPopup(): void {
    const modal = this.dialog.open(CreateStudentComponent, {
      width: '100%',
      maxWidth: '100%',
      minWidth: '100%',
      height: '100vh',
      minHeight: '100vh',
      maxHeight: '100vh',
    });

    modal.afterClosed().subscribe(result => {
      this.isProgress = true;

      this.getStudents();
    });
  }

  addStudentsMassiveToClass(): void {
    const modal = this.dialog.open(AddStudentsMassiveToClassComponent, {
      width: '600px',
      height: '600px',
      data: {
        studentsId: this.selection.selected,
      }
    });

    modal.afterClosed().subscribe(result => {
      this.isProgress = true;

      this.getStudents();
    });
  }

  getStudents(): void {
    const params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('per_page', this.pageSize.toString());

    const header = this.setHeaderAuthorization();

    this.http.get<any>('/api/School/Classes/StudentDontClass', {headers: header, params: params})
      .subscribe(response => {
        this.isProgress = false;

        this.students = response.data;
        this.dataSource.data = this.students;

        this.currentPage = response.current_page;
        this.totalPages = response.last_page;

        this.totalItems = response.total;

        this.pagination = response;
      });
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

        this.getCheckErrorForMassive(data, action, 'student');

        this.getStudents();
      },
      error: (error) => {
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
