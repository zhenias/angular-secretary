import {AfterViewInit, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {AppComponent} from '../../app.component';
import {NgIf} from '@angular/common';
import {getUnits} from '../../shared/service/core/secretariat/units';
import {getTeachers} from '../../shared/service/core/secretariat/teachers';
import {classes} from '../../shared/service/core/secretariat/classes';
import {HttpClient} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    NgIf,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent extends AppComponent implements AfterViewInit {
  public countUnits: number = 0;
  public countClasses: number = 0;
  public countEmployees: number = 0;
  public countStudentsNotClass: number = 0;
  public countStudentsInClass: number = 0;

  constructor(private http: HttpClient) {
    super();
  }

  async ngAfterViewInit() {
    this.countUnits = await getUnits().then(res => res.length);
    this.countClasses = await classes().then(res => res.length);

    this.countEmployees = await getTeachers(100, 1).then(res => res.data.length);

    const header = this.setHeaderAuthorization();

    this.http.get<any>('/api/School/Classes/StudentDontClass', {headers: header})
      .subscribe(response => {
        this.countStudentsNotClass = response.total;
      });

    this.http.get<any>('/api/School/Classes/StudentInClass', {headers: header})
      .subscribe(response => {
        this.countStudentsInClass = response.total;
      });
  }
}
