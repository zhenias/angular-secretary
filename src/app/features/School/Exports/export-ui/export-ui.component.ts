import {Component, Inject} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {NgForOf, NgIf} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-export-ui',
  imports: [
    MatCardModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    NgForOf,
    NgIf,
  ],
  standalone: true,
  templateUrl: './export-ui.component.html',
})
export class ExportUIComponent {
  selectedData: string = '';
  public classes: any[] = [];
  public classId: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { setHeaderAuthorization: HttpHeaders }, private http: HttpClient) {
    this.getClasses();
  }

  public getClasses(): void {
    const headers = this.data.setHeaderAuthorization;

    this.http.get<any[]>('/api/School/Classes', {headers}).subscribe({
      next: (data) => {
        this.classes = data;
      },
    });
  }

  exportStudentsXML() {
    const params = {wyeksportuj_tylko_klasy: this.selectedData == 'export_tylko_klasa' ? 1 : 0};

    return this.http.get((this.selectedData === 'export_all_sou' || this.selectedData === 'export_tylko_klasa') ?
      '/api/School/Export/Students' :
      `/api/School/Classes/${this.classId}/Export/Students`, {
      params,
      responseType: 'blob',
      headers: this.data.setHeaderAuthorization
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.selectedData == 'export_tylko_klasa' ? 'UczniowieTylkoKlasaEksport.sou' : 'UczniowieEksport.sou';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
