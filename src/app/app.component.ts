import {Component, inject, OnInit} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import {ExportUIComponent} from './features/School/Exports/export-ui/export-ui.component';
import {MatTreeModule} from '@angular/material/tree';
import {ErrorDialogComponent} from './shared/error/error-dialog/error-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';
import {
  LoginRestrictionsTeacherComponent
} from './features/School/LoginRestrictions/login-restrictions-teacher/login-restrictions-teacher.component';
import env from './shared/service/env/env.service';
import getCookie from './shared/service/cookie/cookie.service';
import {AuthService} from './shared/service/auth/auth.service';
import {getMe} from './shared/service/auth/auth.types';
import {ViewStudentsComponent} from './features/School/SearchStudents/view-students/view-students.component';
import {ErrorPermissionComponent} from './shared/error/error-permission/error-permission.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatIconModule, MatListModule,
    MatToolbarModule, MatProgressBarModule, ReactiveFormsModule, NgIf, MatSidenavModule,
    MatSnackBarModule, MatButtonModule,
    MatMenuModule, MatBadgeModule, MatTooltipModule, RouterOutlet, RouterLinkActive, RouterLink,
    MatTreeModule, MatTabsModule, ErrorPermissionComponent
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public title = env.name;

  public countMessage: number = 0;
  public router = inject(Router);
  public appRoute = inject(ActivatedRoute);
  readonly matDialog = inject(MatDialog);
  public drawer: any;
  protected accessToken: string | null = '';
  protected isProgress: boolean = false;
  protected appHttp = inject(HttpClient);
  protected getMeInfo: getMe = {};
  protected _env = env;
  protected _getMeInfo = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  public naborMenuOpen = false;
  public uzytkownicyMenuOpen = false;
  public rejestrKartRowerowychMenuOpen: boolean = false;
  public ustawieniaMenuOpen: boolean = false;
  public szkolaMenuOpen: boolean = false;

  constructor() {
  }

  async ngOnInit() {
    this.getMeLoad();
    this.getMessageCount();
  }

  public exportConfigs(): void {
    if (!this.getMeInfo.is_admin && !this.getMeInfo.is_secretary) {
      this.showErrorBox(
        'Brak uprawnień.',
        'Nie masz wystarczająco uprawnień, by móc skorzystać z tej części eksportów.'
      );

      return;
    }

    this.matDialog.open(ExportUIComponent, {
      width: '500px',
      height: '500px',
      disableClose: true,
      data: {
        setHeaderAuthorization: this.setHeaderAuthorization(),
      }
    });
  }

  public searchStudents(): void {
    this.matDialog.open(ViewStudentsComponent, {
      width: '1000px',
      height: '900px',
    });
  }

  public getLoginRestrictionsPopup(): void {
    if (!this.getMeInfo.is_admin) {
      this.showErrorBox(
        'Brak uprawnień.',
        'Brak uprawnień do zarządzanie restrykcją logowania.'
      );

      return;
    }

    this.matDialog.open(LoginRestrictionsTeacherComponent, {
      width: '800px',
      height: '800px',
      disableClose: true,
      data: {
        setHeaderAuthorization: this.setHeaderAuthorization(),
      }
    });
  }

  public showErrorBox(title: string, description: string): void {
    this.matDialog.open(ErrorDialogComponent, {
      width: '500px',
      height: '500px',
      disableClose: true,
      data: {
        title, description
      }
    });
  }

  public getMessageCount(): void {
    this._getMeInfo.getMessagesCount().subscribe({
      next: (count) => {
        this.countMessage = count;
      }
    });
  }

  public getMeLoad(): void {
    this._getMeInfo.getMeInfo().subscribe({
      next: (data: getMe) => {
        this.getMeInfo = data;
      },
      error: () => {
        this.openSnackBar('Wystąpił błąd, podczas pobierania informacji.', 'OK');
      }
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

  protected openSnackBar(message: string, action: string = 'OK') {
    this._snackBar.open(message, action, {
      duration: 1800,
      horizontalPosition: 'center',
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

  protected setHeaderAuthorization(): HttpHeaders {
    const accessTokenCookie = getCookie('_token');
    this.accessToken = accessTokenCookie || this._env.accessTokenTest;

    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-type': 'application/json',
      'Accept': 'application/json'
    });
  }
}
