import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe, NgIf } from "@angular/common";
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortHeader } from '@angular/material/sort';
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
} from "@angular/material/table";
import { MatTooltip } from '@angular/material/tooltip';
import { AppComponent } from '../../../app.component';
import { LoadingHTMLComponent } from '../../../shared/components/loading-html/loading-html.component';
import { getDokumenty } from '../../../shared/service/core/secretariat/dokumenty.service';
import { CreateDokumentyComponent } from '../create-dokumenty/create-dokumenty.component';
import { EditDokumentyComponent } from '../edit-dokumenty/edit-dokumenty.component';
import { PrintDokumentyComponent } from '../print-dokumenty/print-dokumenty.component';

@Component({
  selector: 'app-view-dokumenty',
  imports: [
    FormsModule,
    MatButton,
    MatIcon,
    MatIconButton,
    NgIf,
    MatCell,
    MatCellDef,
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
    LoadingHTMLComponent,
    MatCard,
    DatePipe
],
  templateUrl: './view-dokumenty.component.html',
  styleUrl: './view-dokumenty.component.css'
})
export class ViewDokumentyComponent extends AppComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  displayedColumns: string[] = [
    'actions',
    'name',
    'type',
    'user',
    'created_at',
    'updated_at',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor() {
    super();

    this.isProgress = true;
  }

  async ngAfterViewInit() {
    this.isProgress = true;

    this.dataSource.data = await getDokumenty().finally(() => {
      this.isProgress = false;
    });
  }

  createDokument() {
    const dialog = this.matDialog.open(
      CreateDokumentyComponent,
      {
        width: '100%',
        maxWidth: '100%',
        minWidth: '100%',
        height: '100vh',
        minHeight: '100vh',
        maxHeight: '100vh',
      }
    );

    dialog.afterClosed().subscribe(() => {
      this.ngAfterViewInit();
    });
  }

  editDokument(dokumentId: number) {
    const dialog = this.matDialog.open(
      EditDokumentyComponent,
      {
        width: '100%',
        maxWidth: '100%',
        minWidth: '100%',
        height: '100vh',
        minHeight: '100vh',
        maxHeight: '100vh',
        data: {
          dokumentId,
        }
      }
    );

    dialog.afterClosed().subscribe(() => {
      this.ngAfterViewInit();
    });
  }

  printDokument() {
    const dialog = this.matDialog.open(
      PrintDokumentyComponent,
      {
        width: '100%',
        maxWidth: '100%',
        minWidth: '100%',
        height: '100vh',
        minHeight: '100vh',
        maxHeight: '100vh',
      }
    );

    dialog.afterClosed().subscribe(() => {
      this.ngAfterViewInit();
    });
  }
}
