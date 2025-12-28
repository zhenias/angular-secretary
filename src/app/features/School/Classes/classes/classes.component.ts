import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatTabsModule} from '@angular/material/tabs';
import {DatePipe, NgIf} from '@angular/common';
import {AppComponent} from '../../../../app.component';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatCard} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTooltip} from '@angular/material/tooltip';
import {getClassesInterface} from '../../../../shared/service/core/secretariat/classes';
import {CreateClassComponent} from '../create-class/create-class.component';
import {EditClassComponent} from '../edit-class/edit-class.component';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  imports: [
    MatTabsModule,
    NgIf,
    LoadingHTMLComponent,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCard,
    MatCheckbox,
    MatSort,
    MatSortHeader,
    MatTooltip,
    DatePipe,
  ],
  standalone: true,
})
export class ClassesComponent extends AppComponent implements AfterViewInit {
  public classes: getClassesInterface[] = [];

  public currentPage = 1;
  public pageSize = 50;

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  displayedColumns: string[] = [
    'select',
    'edit',
    'class',
    'teacher',
    'okres_nauki',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(private http: HttpClient) {
    super();

    this.isProgress = true;

    this.getClasses();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  private getClasses() {
    this.isProgress = true;

    const headers = this.setHeaderAuthorization();

    this.http.get<getClassesInterface[]>('/api/School/Classes', {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.dataSource.data = data;

        setTimeout(() => this.dataSource.sort = this.sort);
      },
      error: (error) => {
        this.isProgress = false;

        this.openSnackBar('Błąd pobierania danych o oddziałach.', 'OK');
      }
    });
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

  createClass() {
    const dialog = this.matDialog.open(
      CreateClassComponent,
      {
        width: '800px',
        height: '800px',
        disableClose: true,
      }
    );

    dialog.afterClosed().subscribe((result: any) => {
      this.isProgress = true;

      this.getClasses();
    });
  }

  editClass(classId: number) {
    const dialog = this.matDialog.open(
      EditClassComponent,
      {
        width: '800px',
        height: '800px',
        disableClose: true,
        data: {
          classId,
        }
      }
    );

    dialog.afterClosed().subscribe((result: any) => {
      this.isProgress = true;

      this.getClasses();
    });
  }
}
