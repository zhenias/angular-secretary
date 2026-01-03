import { NgForOf, NgIf } from "@angular/common";
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
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

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      classId: number;
      studentId: number,
    }
  ) {
    super();

    this.getClassesListFetch();
    this.getDokumentyFetch();

    if (data?.classId) {
      this.classId = data.classId;
    }

    if (data?.studentId) {
      this.getStudents();
      
      this.studentId = data.studentId;
    }
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


    this.html = this.render(this.html.length > 0 ? this.html : dokument.html_template, payload);
  }

  render(template: string, data: any): string {
    return template.replace(/{{(.*?)}}/g, (_, key) => {
      const value = key
        .trim()
        .split('.')
        .reduce((o: any, i: any) => o?.[i], data);

      return (value ?? '')
        .replace(/\n{2,}/g, '</p><p>')
        .replace(/\n/g, '<br>');
    });
  }

  print() {
    this.generateDocument();

    const printContent = document.querySelector('.print-area .ql-container .ql-editor')?.innerHTML;
    const w = window.open('', '', 'width=1000,height=600');

    if (!w || !printContent) {
      w?.close();

      return;
    }

    w.document.write(`
      <html lang="pl-PL">
        <head>
          <title>${this.getSelectedDokument()?.name_document}</title>
          <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.7/quill.core.css">
          <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.7/quill.snow.css">
          <style>
            body { padding: 24px; }
            .ql-align-right { text-align: right; }
            .ql-align-left { text-align: left; }
            .ql-align-center { text-align: center; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    w.document.close();

    w.onload = () => {
      w.print();
      w.close();
    };
  }
}
