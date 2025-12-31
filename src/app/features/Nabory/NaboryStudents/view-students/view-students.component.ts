import {Component, ViewChild} from '@angular/core';
import {AppComponent} from '../../../../app.component';
import {
  getNaboryStudents,
  responseNaboryStudentsInterface
} from '../../../../shared/service/core/secretariat/nabory/students';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CreateStudentComponent} from '../create-student/create-student.component';
import {EditStudentComponent} from '../edit-student/edit-student.component';
import {NaboryRecruitmentEndComponent} from '../nabory-recruitment-end/nabory-recruitment-end.component';

@Component({
  selector: 'app-view-students',
  imports: [
    LoadingHTMLComponent,
    MatButtonModule,
    MatIconModule,
    NgIf,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './view-students.component.html',
  standalone: true,
})
export class ViewStudentsComponent extends AppComponent {
  public studentsList: responseNaboryStudentsInterface[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  displayedColumns: string[] = [
    'select',
    'actions',
    'status',
    'class_suggestion',
    'user_lastname',
    'user_name',
    'gender',
    'birthday',
    'pesel',
    'phone_number',
    'adres_zamieszkania',
    'adres_zameldowania',
    'created_at',
  ];
  dataSource = new MatTableDataSource<any>(this.studentsList);

  constructor() {
    super();

    this.isProgress = true;

    this.getStudentsFetch();
  }

  async getStudentsFetch(): Promise<void> {
    try {
      this.dataSource.data = await getNaboryStudents();

      this.isProgress = false;
    } catch (e) {
      this.isProgress = true;

      this.openSnackBar('Wystąpił błąd, podczas pobierania uczniów.', 'OK');
    }
  }

  public createStudentPopUp() {
    const modal = this.matDialog.open(
      CreateStudentComponent,
      {
        width: '800px',
        height: '800px',
      }
    );

    modal.afterClosed().subscribe(() => {
      this.isProgress = true;

      this.getStudentsFetch();
    });
  }

  public recruitmentEndPopUp() {
    const modal = this.matDialog.open(
      NaboryRecruitmentEndComponent,
      {
        width: '1000px',
        maxWidth: '1000px',
        height: '700px',
      }
    );

    modal.afterClosed().subscribe(() => {
      this.isProgress = true;

      this.getStudentsFetch();
    });
  }

  public updateStudentPopUp(userId?: number) {
    const modal = this.matDialog.open(
      EditStudentComponent,
      {
        width: '800px',
        height: '800px',
        data: {
          userId,
        }
      }
    );

    modal.afterClosed().subscribe(() => {
      this.isProgress = true;

      this.getStudentsFetch();
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
