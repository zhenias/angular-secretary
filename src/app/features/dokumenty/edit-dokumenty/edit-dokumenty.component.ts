import { DatePipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { Component, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from "@angular/material/dialog";
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatFormField } from '@angular/material/select';
import { QuillEditorComponent } from 'ngx-quill';
import { AppComponent } from '../../../app.component';
import {
    CreateDocumentTypes,
    deleteDokument,
    DocumentTypes,
    editDokument,
    getDokument
} from "../../../shared/service/core/secretariat/dokumenty.service";
import {TOOLBAR_QUILL} from '../../../app.config';

@Component({
  selector: 'app-edit-dokumenty',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    FormsModule,
    QuillEditorComponent,
    MatProgressBar,
    NgIf,
    NgForOf,
    DatePipe,
    NgClass,
  ],
  templateUrl: './edit-dokumenty.component.html',
  styleUrl: './edit-dokumenty.component.css'
})
export class EditDokumentyComponent extends AppComponent {
  placeholders = [
    { key: 'student.user.full_user_name', label: 'Imię i nazwisko ucznia' },
    { key: 'student.user.user_name', label: 'Imię ucznia' },
    { key: 'student.user.user_lastname', label: 'Nazwisko ucznia' },
    { key: 'student.user.email', label: 'E-mail' },
    { key: 'student.user.numer_telefonu', label: 'Numer telefonu' },
    { key: 'student.user.pesel', label: 'PESEL' },
    { key: 'student.user.gender', label: 'Płeć (M,K)' },
    { key: 'student.user.data_urodzenia', label: 'Data urodzenia' },
    { key: 'student.user.adres_zamieszkania', label: 'Adres zamieszkania' },
    { key: 'student.user.adres_zameldowania', label: 'Adres zameldowania' },
    { key: 'student.user.login', label: 'Login' },
    { key: 'student.user.alias', label: 'Alias' },

    { key: 'student.class.class', label: 'Oddział aktualny' },
    { key: 'student.class.teacher', label: 'Wychowawca' },
    { key: 'student.class.year', label: 'Rok szkolny' },

    { key: 'school.name', label: 'Nazwa jednostki pełna' },
    { key: 'school.short', label: 'Nazwa jednostki skrót' },

    { key: 'today', label: 'Dzisiejsza data' },
  ];

  createDokumentBuild: CreateDocumentTypes = {
    html_template: '',
    name: '',
    type: '',
  };

  getDokumentList: DocumentTypes|{error: string}|any = {};
  TOOLBAR_QUILL = TOOLBAR_QUILL;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      dokumentId: number
    }
  ) {
    super();

    this.isProgress = true;

    this.getDokumentFetch();
  }

  @ViewChild(QuillEditorComponent) quill!: QuillEditorComponent;

  insert(key: string) {
    const q = this.quill.quillEditor;
    const range = q.getSelection(true);

    q.insertText(range.index, `{{${key}}}`);
    q.setSelection(range.index + key.length + 4);

    this.createDokumentBuild.html_template = q.getSemanticHTML();
  }

  async getDokumentFetch() {

    try {
      const response = await getDokument(
        this.data.dokumentId
      ).finally(() => { this.isProgress = false });

      this.createDokumentBuild = {
        ...response,
        name: response.name_document,
      };

      this.getDokumentList = response;

    } catch (e) {
      this.openSnackBar('Wystąpił bład, podczas aktualizacji dokumentu.');
    }
  }

  async updateDokument() {
    try {
      const response = await editDokument(
        this.data.dokumentId,
        this.createDokumentBuild
      );

      if (response.name) {
        this.openSnackBar('Dokument został aktualizowany.');
      }
    } catch (e) {
      this.openSnackBar('Wystąpił bład, podczas aktualizacji dokumentu.');
    }
  }

  async deleteDokumentFetch() {
    try {
      const response = await deleteDokument(
        this.data.dokumentId,
      );

      this.openSnackBar('Dokument został usunięty.');
    } catch (e) {
      this.openSnackBar('Wystąpił bład, podczas usuwania dokumentu.');
    }
  }
}
