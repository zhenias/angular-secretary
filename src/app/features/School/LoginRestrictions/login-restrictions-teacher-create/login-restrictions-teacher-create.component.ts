import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoginRestrictionItem} from '../login-restrictions-teacher/login-restrictions-teacher.component';

export interface PayloadLoginRestrictions {
  user_id?: number,
  day_of_week?: number,
  start_time?: string,
  end_time?: string,
}

@Component({
  selector: 'app-login-restrictions-teacher-create',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    NgForOf,
    FormsModule
  ],
  templateUrl: './login-restrictions-teacher-create.component.html',
})
export class LoginRestrictionsTeacherCreateComponent {
  public daysOfWeek = [
    {value: 1, label: 'Poniedziałek'},
    {value: 2, label: 'Wtorek'},
    {value: 3, label: 'Środa'},
    {value: 4, label: 'Czwartek'},
    {value: 5, label: 'Piątek'},
    {value: 6, label: 'Sobota'},
    {value: 0, label: 'Niedziela'},
  ];

  public teacherList: any[] = [];

  public payload: PayloadLoginRestrictions = {
    start_time: '08:00',
    end_time: '14:00',
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    setHeaderAuthorization: HttpHeaders,
    user_id?: number,
    restrictions?: LoginRestrictionItem[]
  }, private httpClient: HttpClient) {
    this.payload.user_id = data.user_id;

    this.getTeachers();
  }

  isDayDisabled(day: number): boolean {
    return this.data?.restrictions?.some(r => r.day_of_week === day) ?? false;
  }

  public getCreate(): void {
    const headers = this.data.setHeaderAuthorization;

    this.httpClient.post('/api/School/LoginRestrictions', this.payload, {headers}).subscribe({
      next: (response) => {
      },
      error: () => {
      }
    });
  }

  public getTeachers(): void {
    const headers = this.data.setHeaderAuthorization;

    this.httpClient.get<any>('/api/School/Teachers/JSTree', {headers}).subscribe({
      next: (response) => {
        this.teacherList = response.children;
      },
      error: () => {
      }
    });
  }
}
