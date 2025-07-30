import {Component, inject, OnInit} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import {ExportUIComponent} from './School/Exports/export-ui/export-ui.component';
import {MatTreeModule} from '@angular/material/tree';
import {
  AddStudentsMassiveToClassComponent
} from './Students/add-students-massive-to-class/add-students-massive-to-class.component';
import {ErrorDialogComponent} from './Errors/error-dialog/error-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';

interface getMe {
  id?: number,
  user_name?: string;
  user_lastname?: string;
  full_user_name?: string;
  is_admin?: boolean | false;
  is_teacher?: boolean | false;
  is_student?: boolean | false;
  is_parent?: boolean | false;
  is_secretary?: boolean | false;
  is_pedagogue?: boolean | false;
  is_replacements?: boolean | false;
  is_director?: boolean | false;
  class?: string | null | undefined;
  permissions?: string | null | undefined;
  is_super?: boolean | false;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    NgIf,
    MatSidenavModule,
    MatSnackBarModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    MatTreeModule,
    MatTabsModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', 'app.scss']
})
export class AppComponent implements OnInit {
  public title = 'Sekretariat';
  protected accessToken: string | null = '';
  protected isProgress: boolean = false;
  public countMessage: number = 0;

  public router = inject(Router);
  public appRoute = inject(ActivatedRoute);
  private _snackBar = inject(MatSnackBar);
  protected appHttp = inject(HttpClient);
  readonly matDialog = inject(MatDialog);

  protected getMeInfo: getMe = {};
  drawer: any;

  constructor() {

  }

  ngOnInit(): void {
    this.getMe();
  }

  protected openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['snackbar']
    });
  }

  protected copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.openSnackBar('Tekst został skopiowany.', 'OK');
    }).catch(err => {
      this.openSnackBar('Wystąpił błąd, podczas kopiowania tekstu.', 'OK');
    });
  }

  exportConfigs(): void {
    if (!this.getMeInfo.is_admin && !this.getMeInfo.is_secretary) {
      this.showErrorBox('Brak uprawnień.', 'Nie masz wystarczająco uprawnień, by móc skorzystać z tej części eksportów.');

      return;
    }

    this.matDialog.open(ExportUIComponent, {
      width: '600px',
      height: '500px',
      disableClose: true,
      data: {
        setHeaderAuthorization: this.setHeaderAuthorization(),
      }
    });
  }

  showErrorBox(title: string, description: string): void {
    const modal = this.matDialog.open(ErrorDialogComponent, {
      width: '500px',
      height: '500px',
      disableClose: true,
      data: {
        title,
        description
      }
    });
  }

  protected getCheckErrorForMassive(response: any[], action: string, type: string) {
    if (!response?.length || action !== 'deleted') return;

    const title = `${type == 'student' ? 'Uczniowie' : 'Rodzice / Opiekunowie'}, którzy nie mogą zostać usunięci`;

    const description = response.map(item => {
      const name = `<p><strong style="color: red;">${item.name}</strong></p>`;
      const errors = `<ul style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 5px;">${item.blocked.map((err: any) => `<li>${err}</li>`).join('')}</ul>`;
      return name + errors;
    }).join('');

    this.showErrorBox(title, description);
  }

  public getMessageCount(): void {
    const headers = this.setHeaderAuthorization();

    this.appHttp.get<number>(`/api/Messages/Count`, {headers}).subscribe({
      next: (data: number) => {
        this.countMessage = data;
      },
      error: (error) => {
        this.openSnackBar('Wystąpił podczas pobieranie danych o użytkowniku!', 'OK');
      }
    });
  }

  public getMe(): void {
    const headers = this.setHeaderAuthorization();

    this.appHttp.get<getMe>(`/api/getMe`, {headers}).subscribe({
      next: (data: getMe) => {
        this.getMeInfo = data;

        this.getMessageCount();
      },
      error: () => {
        this.openSnackBar('Wystąpił podczas pobieranie danych o użytkowniku!', 'OK');
      }
    });
  }

  protected setHeaderAuthorization(): HttpHeaders {
    const accessTokenCookie = this.getCookie('_token');
    this.accessToken = accessTokenCookie || '4ef9cf84c140e2c58997a5321b40b2ab3a4164f0d414acfbda182cef0e9e5703'

    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-type': 'application/json',
      'Accept': 'application/json'
    });
  }

  public goToStudents(classId: number): void {
    this.router.navigate(['/classes', classId, 'students']);
  }

  public goToLessonPlan(classId: number | null | undefined): void {
    this.router.navigate(['/classes', classId, 'lesson_plan']);
  }

  public goToStudent(studentId: number | null | undefined): void {
    this.router.navigate(['students/edit/', studentId]);
  }

  public getCookie(name: string): string | null {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith(name + '='));

    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }
}
