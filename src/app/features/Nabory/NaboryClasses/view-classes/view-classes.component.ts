import {Component, ViewChild} from '@angular/core';
import {AppComponent} from '../../../../app.component';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';
import {NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SelectionModel} from '@angular/cdk/collections';
import {getNaboryClasses} from '../../../../shared/service/core/secretariat/nabory/classes';
import {MatCardModule} from '@angular/material/card';
import {CreateClassComponent} from '../create-class/create-class.component';
import {EditClassComponent} from '../edit-class/edit-class.component';

@Component({
  selector: 'app-view-classes',
  imports: [
    LoadingHTMLComponent,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatCardModule
  ],
  templateUrl: './view-classes.component.html',
  standalone: true
})
export class ViewClassesComponent extends AppComponent {
  public naboryClasses: any[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  displayedColumns: string[] = [
    'select',
    'actions',
    'class',
    'jednostka',
  ];
  dataSource = new MatTableDataSource<any>(this.naboryClasses);

  constructor() {
    super();

    this.isProgress = true;

    this.getClasses();
  }

  async getClasses(): Promise<void> {
    try {
      this.dataSource.data = await getNaboryClasses();
    } finally {
      this.isProgress = false;
    }
  }

  public createClassPopUp() {
    const modal = this.matDialog.open(CreateClassComponent, {
      width: '500px',
      height: '400px',
    });

    modal.afterClosed().subscribe(() => {
      this.isProgress = true;

      this.getClasses();
    });
  }

  public updateClassPopUp(classId: number) {
    const modal = this.matDialog.open(EditClassComponent, {
      width: '500px',
      height: '400px',
      data: {
        classId
      }
    });

    modal.afterClosed().subscribe(() => {
      this.isProgress = true;

      this.getClasses();
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
