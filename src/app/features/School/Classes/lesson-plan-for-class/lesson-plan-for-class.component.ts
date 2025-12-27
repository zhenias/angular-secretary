import {Component} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {FullCalendarModule} from '@fullcalendar/angular';
import {CalendarOptions} from '@fullcalendar/core';
import {MatCardModule} from '@angular/material/card';
import plLocale from '@fullcalendar/core/locales/pl';
import timeGridPlugin from '@fullcalendar/timegrid';
import {AppComponent} from '../../../../app.component';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {LoadingHTMLComponent} from '../../../../shared/components/loading-html/loading-html.component';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-lesson-plan-for-class',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatCardModule,
    MatButtonModule,
    LoadingHTMLComponent,
    MatIcon,
    MatTooltip
  ],
  templateUrl: './lesson-plan-for-class.component.html',
  styleUrl: './lesson-plan-for-class.component.css'
})
export class LessonPlanForClassComponent extends AppComponent {
  planLessons: any[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin],
    // height: '100',
    locale: plLocale,
    initialView: 'timeGridWeek',
    nowIndicator: true,
    events: this.planLessons,
    slotDuration: '00:10:00',
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    eventClick: (info) => {
      info.jsEvent.preventDefault();

      if (info.event.allDay) {
        this.openSnackBar('Kalendarz: ' + info.event.title, 'OK');

        return;
      }
      this.openSnackBar('Lekcja: ' + info.event.title, 'OK');
    },
    eventDidMount: function (info) {
      info.el.setAttribute("title", info.event.title);
    }
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location
  ) {
    super();

    this.isProgress = true;

    const classId = Number(this.route.snapshot.paramMap.get('classId'));

    this.getFetchLessonsPlan(classId);
  }

  public getFetchLessonsPlan(classId: number): void {
    const headers = this.setHeaderAuthorization();

    this.http.get<any[]>('/api/School/Classes/' + classId + '/LessonPlan', {headers}).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.planLessons = data;

        this.calendarOptions.events = this.planLessons;
      },
      error: () => {
        this.isProgress = false;

        this.openSnackBar(
          'Wystąpił błąd, podczas pobierania planu lekcji, spróbuj później.',
          'OK'
        );
      }
    });
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();

      return;
    }

    this.router.navigate(['/classes']);
  }
}
