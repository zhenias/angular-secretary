import {Component, ViewChild} from '@angular/core';
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
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {getWycieczki} from '../../../../shared/service/core/secretariat/wycieczki.service';
import {AppComponent} from '../../../../app.component';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';
import {MatCard} from '@angular/material/card';
import {NgClass, NgIf} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-view-wycieczki',
  templateUrl: './view-wycieczki.component.html',
  standalone: true,
  imports: [
    LoadingHTMLComponent, MatCard, MatSortHeader, MatColumnDef, MatTable, MatSort, MatHeaderCell, MatCellDef,
    MatHeaderCellDef, MatCell, MatHeaderRow, MatRow, MatRowDef, MatHeaderRowDef, NgIf, NgClass, MatIcon, MatIconButton, MatTooltip
  ]
})
export class ViewWycieczkiComponent extends AppComponent {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['status', 'name', 'owner', 'cel', 'date', 'uczniowie', 'opiekunowie', 'created_at'];

  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    super();
    this.getWycieczkiFetch();
  }

  async getWycieczkiFetch() {
    this.isProgress = true;

    const response = await getWycieczki().finally(() => {
      this.isProgress = false;
      this.dataSource.sort = this.sort;
    });

    this.dataSource.data = response;
    this.dataSource.sort = this.sort;
  }
}
