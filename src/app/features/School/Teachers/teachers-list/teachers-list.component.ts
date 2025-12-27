import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {AppComponent} from '../../../../app.component';
import {NgClass, NgIf} from '@angular/common';
import {LoadingHTMLComponent} from "../../../../shared/components/loading-html/loading-html.component";
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SelectionModel} from '@angular/cdk/collections';
import {EditTeacherComponent} from '../edit-teacher/edit-teacher.component';
import {getTeachers} from '../../../../shared/service/core/secretariat/teachers';

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
  standalone: true,
})
export class TeachersListComponent extends AppComponent implements AfterViewInit {
  public teachers: any[] = [];
  public currentPage = 1;
  public totalPages = 0;
  public pageSize = 50;

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  displayedColumns: string[] = [
    // 'select',
    'actions',
    'full_user_name',
    'login',
    'data_urodzenia',
    'permissions',
    'is_active',
    'data_rejestracji',
  ];
  dataSource = new MatTableDataSource<any>();

  totalItems: number = 1;

  constructor() {
    super();

    this.isProgress = true;

    this.getTeachersFetch();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  async getTeachersFetch() {
    try {
      const response = await getTeachers(
        this.pageSize,
        this.currentPage,
      );

      this.teachers = response.data;
      this.dataSource.data = this.teachers;

      this.currentPage = response.current_page;
      this.totalPages = response.last_page;

      this.totalItems = response.total;

      this.isProgress = false;
      setTimeout(() => this.dataSource.sort = this.sort);
    } catch (e) {
      this.openSnackBar(
        'Wystąpił błąd, podczas pobierania pracowników.',
        'OK'
      )
    }
  }

  async onPageChange(event: PageEvent) {
    this.isProgress = true;

    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;

    this.getTeachersFetch();
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

  teacherEdit(userId: number) {
    if (!this.getMeInfo.is_admin) return;

    const dialog = this.matDialog.open(EditTeacherComponent, {
      width: '800px',
      height: '800px',
      data: {
        userId,
      }
    });

    dialog.afterClosed().subscribe(result => {
      this.isProgress = true;

      this.getTeachersFetch();
    });
  }
}
