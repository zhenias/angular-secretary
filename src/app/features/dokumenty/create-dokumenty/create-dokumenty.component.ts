import { NgForOf } from "@angular/common";
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from "@angular/material/button";
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { MatFormField, MatInput } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { AppComponent } from '../../../app.component';
import { CreateDocumentTypes, createDokument } from '../../../shared/service/core/secretariat/dokumenty.service';

@Component({
  selector: 'app-create-dokumenty',
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
      NgForOf
],
  templateUrl: './create-dokumenty.component.html',
  styleUrl: './create-dokumenty.component.css'
})
export class CreateDokumentyComponent extends AppComponent {
  createDokumentBuild: CreateDocumentTypes = {
    html_template: '',
    name: '',
    type: '',
  };

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


  async createDokument() {
    try {
      const response = await createDokument(
        this.createDokumentBuild
      );

      if (response.name) {
        this.openSnackBar('Dokument został dodany.');
      }
    } catch (e) {
      this.openSnackBar('Wystąpił bład, podczas dodawania dokumentu.');
    }
  }

  @ViewChild(QuillEditorComponent) quill!: QuillEditorComponent;

  insert(key: string) {
    const q = this.quill.quillEditor;
    const range = q.getSelection(true);

    q.insertText(range.index, `{{${key}}}`);
    q.setSelection(range.index + key.length + 4);
  }
}
