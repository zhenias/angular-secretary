import { NgForOf, NgIf } from "@angular/common";
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatSelect, MatSelectModule } from '@angular/material/select';
import { QuillEditorComponent } from 'ngx-quill';
import { AppComponent } from '../../../app.component';
import { classes } from '../../../shared/service/core/secretariat/classes';
import { getDokumenty, type DocumentTypes } from '../../../shared/service/core/secretariat/dokumenty.service';
import { getStudents } from "../../../shared/service/core/secretariat/student/student.service";
import type { StudentInfo } from "../../Student/students.types";

@Component({
  selector: 'app-print-dokumenty',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    FormsModule,
    MatSelect,
    MatSelectModule,
    NgForOf,
      QuillEditorComponent,
      NgIf
],
  templateUrl: './print-dokumenty.component.html',
  styleUrl: './print-dokumenty.component.css'
})
export class PrintDokumentyComponent extends AppComponent {
  classId: number = 0;
  studentId: number = 0;
  dokumentId: number = 0;
  getClassesList: any[] = [];
  getDokumentyList: DocumentTypes[] = [];
  getStudentsList: StudentInfo[] = [];
  html: any = '';

  constructor() {
    super();

    this.getClassesListFetch();
    this.getDokumentyFetch();
  }

  async getClassesListFetch(): Promise<void> {
    this.isProgress = true;

    try {
      this.getClassesList = await classes().finally(() => {
        this.isProgress = false;
      });
    } catch (e) {
      this.isProgress = false;
    }
  }

  async getDokumentyFetch(): Promise<void> {
    this.isProgress = true;

    try {
      this.getDokumentyList = await getDokumenty().finally(() => {
        this.isProgress = false;
      });
    } catch (e) {
      this.isProgress = false;
    }
  }

  async getStudents() {
    this.isProgress = true;

    try {
      const response = await getStudents(this.classId).finally(() => {
        this.isProgress = false;
      });

      this.getStudentsList = response.students;
    } catch (e) {
      this.isProgress = false;
    }
  }

  getSelectedStudent(): any {
    return this.getStudentsList.find(s => s.id === this.studentId);
  }

  getSelectedDokument(): DocumentTypes | undefined {
    return this.getDokumentyList.find(d => d.id === this.dokumentId);
  }

  generateDocument() {
    const student = this.getSelectedStudent();
    const dokument = this.getSelectedDokument();

    if (!student || !dokument) {
      this.html = '';
      return;
    }

    const payload = {
      student: {
        user: student.user ?? {},
        class: student.class ?? {},
      },
      school: student.class?.unit ?? {},
      today: new Date().toLocaleDateString('pl-PL'),
    };


    this.html = this.render(dokument.html_template, payload);
  }

  render(template: string, data: any): string {
    return template.replace(/{{(.*?)}}/g, (_, key) => {
      const value = key
        .trim()
        .split('.')
        .reduce((o: any, i: any) => o?.[i], data);

      return value ?? '';
    });
  }

  print() {
    this.generateDocument();

    const printContent = this.html;
    const w = window.open('', '', 'width=1000,height=1000');

    if (!w || !printContent) {
      w?.close();

      return;
    }

    w.document.write(`
      <html>
        <head>
          <title>${this.getSelectedDokument()?.name_document}</title>
          <link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
          <style>
            body { font-family: serif; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    w.document.close();
    w.print();
    w.close();
  }

}
