import { Component } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { LoadingHTMLComponent } from '../../../loading-html/loading-html.component';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from "@angular/material/icon";

interface ClassInfo {
  id: number,
  class: string,
  symbol: string,
  level: number,
  unit: {
    id: number,
    name: string,
    short: string,
    maxLevel: number,
  },
}

interface ClassData {
  students: any[];
  class: ClassInfo;
}

@Component({
  selector: 'app-student-in-class',
    imports: [
        LoadingHTMLComponent,
        MatCardModule,
        NgFor,
        NgIf,
        MatButtonModule,
        RouterLink,
        MatIconModule
    ],
  templateUrl: './student-in-class.component.html',
  styleUrl: './student-in-class.component.css'
})
export class StudentInClassComponent extends AppComponent {
  public studentsAll: any[] = [];
  public getClass: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    super();

    this.isProgress = true;

    this.getStudents();
  }

  private getStudents() {
    const headers = this.setHeaderAuthorization();

    const classId = this.route.snapshot.paramMap.get('classId');

    this.http.get<ClassData>('/api/School/Classes/' + classId + '/Students', { headers }).subscribe({
      next: (data) => {
        this.isProgress = false;

        this.studentsAll = data.students;
        this.getClass = data.class;
      },
      error: (error) => {
        this.isProgress = false;
        console.error('Błąd pobierania uczniów z oddziału.');

        this.openSnackBar('Błąd podczas pobieranie uczniów z oddziałów.', 'OK');
      },
    });
  }
}
