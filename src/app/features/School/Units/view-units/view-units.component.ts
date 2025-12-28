import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {AppComponent} from '../../../../app.component';
import {getClassesInterface} from '../../../../shared/service/core/secretariat/classes';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {HttpClient} from '@angular/common/http';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';
import {MatCard} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIconButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {getUnits} from '../../../../shared/service/core/secretariat/units';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-view-units',
  imports: [
    LoadingHTMLComponent,
    MatCard,
    MatCell,
    MatCellDef,
    MatCheckbox,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatTooltip,
    NgIf,
    MatHeaderCellDef,
  ],
  templateUrl: './view-units.component.html',
  styleUrl: './view-units.component.css'
})
export class ViewUnitsComponent extends AppComponent implements AfterViewInit {
  public classes: getClassesInterface[] = [];

  public currentPage = 1;
  public pageSize = 50;

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  displayedColumns: string[] = [
    // 'select',
    // 'actions',
    'name',
    'short',
    'type',
    'kategoria_uczniow',
    'maxLevel',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(private http: HttpClient) {
    super();

    this.isProgress = true;

    this.getUnits();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  private async getUnits() {
    this.isProgress = true;

    const units = await getUnits().finally(() => {
      this.isProgress = false;
    });

    this.dataSource.data = units;

    setTimeout(() => this.dataSource.sort = this.sort);
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

