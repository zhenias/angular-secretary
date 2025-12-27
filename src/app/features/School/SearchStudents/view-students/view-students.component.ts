import {Component, inject} from '@angular/core';
import {searchQuery, searchStudents} from '../../../../shared/service/core/secretariat/searchStudents';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {StudentInfo} from '../../../Student/students.types';
import {classes} from '../../../../shared/service/core/secretariat/classes';

@Component({
  selector: 'app-view-students',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    NgIf,
    NgForOf,
    MatIconModule
  ],
  templateUrl: './view-students.component.html',
})
export class ViewStudentsComponent {
  public buildQuery: searchQuery = {};
  public listStudents: StudentInfo[] = [];
  public isProgress = true;
  public router = inject(Router);
  public showFilters = true;
  public classes: any[] = [];

  constructor() {
    this.getClasses();
  }

  async studentsFetch() {
    this.listStudents = (await searchStudents(this.buildQuery)).data;

    this.isProgress = false;
    this.showFilters = false;
  }

  async getClasses(): Promise<void> {
    this.classes = await classes();
  }

  public clearQuery(): void {
    this.buildQuery = {};
  }

  public goToStudent(studentId: number | null | undefined): void {
    this.router.navigate([
      'dashboard',
    ], {
      skipLocationChange: true
    });

    this.router.navigate([
      'students/edit/',
      studentId
    ]);
  }
}
