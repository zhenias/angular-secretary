import {Component, ViewChild} from '@angular/core';
import { AppComponent } from '../../../../app.component';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { LoadingHTMLComponent } from '../../../../shared/components/loading-html/loading-html.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from "@angular/material/icon";
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatTooltip} from '@angular/material/tooltip';
import {NgIf} from '@angular/common';

interface ClassInfo {
  id: number,
  class: string,
  symbol: string,
  level: number,
  unit: {
    id: number,
    name: string,
    short: string,
    maxLevel: number,
  },
}

interface ClassData {
  students: any[];
  class: ClassInfo;
}

@Component({
  selector: 'app-student-in-class',
  imports: [
    LoadingHTMLComponent,
    MatCardModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatCell,
    MatCellDef,
    MatCheckbox,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatTooltip,
    MatHeaderCellDef,
    RouterLink,
  ],
  templateUrl: './student-in-class.component.html',
  standalone: true
})
export class StudentInClassComponent extends AppComponent {
  public studentsAll: any[] = [];
  public getClass: any;

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  displayedColumns: string[] = [
    'select',
    'actions',
    'full_user_name',
    'id_number',
    'w_klasie_od',
    'powod_skreslenia',
    'data_dodania',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    super();

    this.isProgress = true;

    this.getStudents();
  }

  private getStudents() {
    this.isProgress = true;

    const headers = this.setHeaderAuthorization();

    const classId = this.route.snapshot.paramMap.get('classId');

    this.http.get<ClassData>('/api/School/Classes/' + classId + '/Students', { headers }).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.studentsAll = data.students;
        this.getClass = data.class;

        this.dataSource.data = this.studentsAll;
      },
      error: (error) => {
        this.isProgress = false;
        console.error('Błąd pobierania uczniów z oddziału.');

        this.openSnackBar('Błąd podczas pobieranie uczniów z oddziałów.', 'OK');
      },
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
}
