import {Component} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {FullCalendarModule} from '@fullcalendar/angular';
import {CalendarOptions} from '@fullcalendar/core';
import {MatCardModule} from '@angular/material/card';
import plLocale from '@fullcalendar/core/locales/pl';
import timeGridPlugin from '@fullcalendar/timegrid';
import {AppComponent} from '../../../app.component';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {LoadingHTMLComponent} from '../../../loading-html/loading-html.component';

@Component({
  selector: 'app-lesson-plan-for-class',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatCardModule,
    MatButtonModule,
    LoadingHTMLComponent
  ],
  templateUrl: './lesson-plan-for-class.component.html',
  styleUrl: './lesson-plan-for-class.component.css'
})
export class LessonPlanForClassComponent extends AppComponent {
  planLessons: any[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin],
    height: 600,
    locale: plLocale,
    initialView: 'timeGridWeek',
    nowIndicator: true,
    events: this.planLessons,
    slotDuration: '00:50:00',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    eventClick: (info) => {
      info.jsEvent.preventDefault();

      this.openSnackBar('Lekcja: ' + info.event.title, 'OK');
    },
    eventDidMount: function(info) {
      info.el.setAttribute("title", info.event.title);
    }
  };

  constructor(private http: HttpClient, private route: ActivatedRoute, private location: Location) {
    super();

    this.isProgress = true;

    const classId: string | null = this.route.snapshot.paramMap.get('classId');

    this.getFetchLessonsPlan(classId);
  }

  public getFetchLessonsPlan(classId: string | null): void {
    const headers = this.setHeaderAuthorization();

    this.http.get<any[]>('/api/School/Classes/' + classId + '/LessonPlan', {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.planLessons = data;

        this.calendarOptions.events = this.planLessons;
      },
      error: (error) => {
        this.isProgress = false;

        this.openSnackBar('Błąd pobierania planu lekcji.', 'OK');
      }
    });
  }


  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/classes']);
    }
  }
}
