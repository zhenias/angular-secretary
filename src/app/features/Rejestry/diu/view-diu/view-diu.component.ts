import {Component, ViewChild} from '@angular/core';
import {AppComponent} from '../../../../app.component';
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
import {getDIUs} from '../../../../shared/service/core/secretariat/student/diu.service';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';
import {MatCard} from '@angular/material/card';
import {MatIconButton} from '@angular/material/button';
import {NgClass, NgIf} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-view-diu',
  imports: [
    LoadingHTMLComponent,
    MatCard,
    MatCell,
    MatCellDef,
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
    NgClass,
    MatHeaderCellDef,
  ],
  templateUrl: './view-diu.component.html',
  standalone: true,
  styleUrl: './view-diu.component.css'
})
export class ViewDiuComponent extends AppComponent {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'user',
    'year',
    'cele_pracy',
    'metody_pracy',
    'dostosowania',
    'inne_informacje',
    'status',
    'date',
    'user_add',
  ];

  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    super();

    this.getDIUFetch();
  }

  async getDIUFetch() {
    this.isProgress = true;

    const response = await getDIUs().finally(() => {
      this.isProgress = false;

      this.dataSource.sort = this.sort;
    });

    this.dataSource.data = response;
    setTimeout(() => { this.dataSource.sort = this.sort; });
  }
}
