import {Component, Inject, ViewChild} from '@angular/core';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {
  LoginRestrictionsTeacherCreateComponent
} from '../login-restrictions-teacher-create/login-restrictions-teacher-create.component';

export interface LoginRestrictionItem {
  id?: number,
  day_of_week?: number,
  start_time?: string,
  end_time?: string,
}

export interface LoginRestrictionsAll {
  user_id: number,
  user_name?: string | null,
  restrictions?: LoginRestrictionItem[] | null,
}

@Component({
  selector: 'app-login-restrictions-teacher',
  imports: [MatCardModule, MatTableModule, MatSortModule, MatCheckboxModule, MatTooltipModule, MatIconModule, MatButtonModule, NgIf, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './login-restrictions-teacher.component.html',
  standalone: true,
})
export class LoginRestrictionsTeacherComponent {
  public getRestrictionsList: LoginRestrictionsAll[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<number>(true, []);

  displayedColumns: string[] = [
    // 'select',
    'actions',
    'user',
    'count_restrictions',
  ];
  dataSource = new MatTableDataSource<any>(this.getRestrictionsList);

  public isProgress: boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    setHeaderAuthorization: HttpHeaders
  }, private appHttp: HttpClient, private matDialog: MatDialog) {
    this.getRestrictions();
  }

  getRestrictions(): void {
    const headers = this.data.setHeaderAuthorization;

    this.appHttp.get<LoginRestrictionsAll[]>('/api/School/LoginRestrictions', {headers}).subscribe({
      next: (response: LoginRestrictionsAll[]) => {
        this.isProgress = false;

        this.getRestrictionsList = response;

        this.dataSource.data = this.getRestrictionsList;
      }, error: () => {
        this.isProgress = false;
      }
    });
  }

  sortData(sort: Sort) {
    const data = this.getRestrictionsList.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'count_restrictions':
          return this.compare(a?.restrictions?.length, b?.restrictions?.length, isAsc);
        case 'user':
          return this.compare(a?.user_name, b?.user_name, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string | null | undefined, b: number | string | null | undefined, isAsc: boolean) {
    if (a == null && b == null) return 0;
    if (a == null) return isAsc ? -1 : 1;
    if (b == null) return isAsc ? 1 : -1;

    if (typeof a === 'string' && typeof b === 'string') {
      return (a.localeCompare(b)) * (isAsc ? 1 : -1);
    }

    return ((a < b ? -1 : (a > b ? 1 : 0)) * (isAsc ? 1 : -1));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows && numRows > 0;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row.id));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'Odznacz' : 'Zaznacz'} wszystkie`;
    }
    return `${this.selection.isSelected(row.id) ? 'Odznacz' : 'Zaznacz'} wiersz`;
  }

  public getCreateRestrictionsForUser(userId: number, userName: string): void {
    const userRestrictions = this.getRestrictionsList.find(u => u.user_id == userId)?.restrictions;

    const modal = this.matDialog.open(LoginRestrictionsTeacherCreateComponent, {
      width: '600px', height: '600px',
      data: {
        setHeaderAuthorization: this.data.setHeaderAuthorization,
        user_id: userId,
        restrictions: userRestrictions,
      }
    });

    modal.afterClosed().subscribe(() => {
      this.isProgress = true;

      this.getRestrictions();
    });
  }

  public getCreateRestrictionsSelectUser(): void {
    const modal = this.matDialog.open(LoginRestrictionsTeacherCreateComponent, {
      width: '600px', height: '600px',
      data: {
        setHeaderAuthorization: this.data.setHeaderAuthorization,
      }
    });

    modal.afterClosed().subscribe(() => {
      this.isProgress = true;

      this.getRestrictions();
    });
  }

  getFetchDelete(userId: number): void {
    const headers = this.data.setHeaderAuthorization;

    this.appHttp.delete(`/api/School/LoginRestrictions/User/${userId}`, {headers}).subscribe({
      next: () => {
        this.isProgress = true;

        this.getRestrictions();
      }, error: () => {
        this.isProgress = false;

        alert('Nie udało się usunąć restrykcję logowania dla pracownika.');
      }
    });
  }
}
