import {Component, ViewChild} from '@angular/core';
import {LoadingHTMLComponent} from "../../../../shared/components/loading-html/loading-html.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {NgIf} from "@angular/common";
import {AppComponent} from '../../../../app.component';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {BicycleCardCreateComponent} from '../../KartyRowerowe/bicycle-card-create/bicycle-card-create.component';
import {BicycleCardEditComponent} from '../../KartyRowerowe/bicycle-card-edit/bicycle-card-edit.component';
import {
  BicycleCardSetDataMassiveComponent
} from '../../KartyRowerowe/bicycle-card-set-data-massive/bicycle-card-set-data-massive.component';
import {getKartaRowerowa} from '../../KartyRowerowe/rejestr-kart-rowerowych/rejestr-kart-rowerowych.component';
import {ExamTypes, getExams} from '../../../../shared/service/core/secretariat/student/exams.service';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {DodajEgzaminComponent} from '../dodaj-egzamin/dodaj-egzamin.component';
import {EdytujEgzaminComponent} from '../edytuj-egzamin/edytuj-egzamin.component';

@Component({
  selector: 'app-view-egzaminy',
  imports: [
    LoadingHTMLComponent,
    MatButton,
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
    MatHeaderCellDef
  ],
  templateUrl: './view-egzaminy.component.html',
})
export class ViewEgzaminyComponent extends AppComponent {
  public getExams: ExamTypes[] = [];

  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'select',
    'actions',
    'student',
    'name',
    'result',
    'date',
    'create'
  ];

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  constructor() {
    super();

    this.getFetchEgzaminy();
  }

  async getFetchEgzaminy() {
    this.isProgress = true;

    const response = await getExams().finally(() => {
      this.isProgress = false;
    });

    this.dataSource.data = response;
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

  examCreate() {
    const dialog = this.matDialog.open(
      DodajEgzaminComponent,
      {
        width: '600px',
        height: '400px',
      }
    );

    dialog.afterClosed().subscribe(result => {
      this.isProgress = true;

      this.getFetchEgzaminy();
    });
  }

  examUpdate(examId: number) {
    const dialog = this.matDialog.open(
      EdytujEgzaminComponent,
      {
        width: '600px',
        height: '400px',
        data: {
          examId
        }
      }
    );

    dialog.afterClosed().subscribe(result => {
      this.isProgress = true;

      this.getFetchEgzaminy();
    });
  }

  // bicycleCardCreate() {
  //   const dialog = this.matDialog.open(BicycleCardCreateComponent, {
  //     width: '600px',
  //     height: '600px',
  //     disableClose: true,
  //     data: {
  //       count: this.totalItems,
  //     }
  //   });
  //
  //   dialog.afterClosed().subscribe(result => {
  //     this.isProgress = true;
  //
  //     this.getFetchBicycleCards();
  //   });
  // }
  //
  // bicycleCardEdit(cardId: number) {
  //   const dialog = this.matDialog.open(BicycleCardEditComponent, {
  //     width: '600px',
  //     height: '600px',
  //     data: {
  //       cardId,
  //     }
  //   });
  //
  //   dialog.afterClosed().subscribe(result => {
  //     this.isProgress = true;
  //
  //     this.getFetchBicycleCards();
  //   });
  // }
  //
  // bicycleCardMassiveUpdate(): void {
  //   const dialog = this.matDialog.open(BicycleCardSetDataMassiveComponent, {
  //     width: '600px',
  //     height: '600px',
  //     data: {
  //       cardsId: this.selection.selected,
  //     }
  //   });
  //
  //   dialog.afterClosed().subscribe(result => {
  //     this.isProgress = true;
  //
  //     this.getFetchBicycleCards();
  //   });
  // }
}
