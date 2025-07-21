import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatTabsModule} from '@angular/material/tabs';
import {NgForOf, NgIf} from '@angular/common';
import {AppComponent} from '../../../app.component';
import {LoadingHTMLComponent} from '../../../loading-html/loading-html.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCellDef, MatHeaderCellDef, MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  imports: [
    MatTabsModule,
    NgForOf,
    NgIf,
    LoadingHTMLComponent,
    MatButtonModule,
    MatTableModule,
  ],
  standalone: true,
})
export class ClassesComponent extends AppComponent {
  public units: any[] = [];
  public classes: any[] = [];

  constructor(private http: HttpClient) {
    super();

    this.isProgress = true;

    this.getUnits();
  }

  private getUnits() {
    const headers = this.setHeaderAuthorization();

    this.http.get<any[]>('/api/School/Units', {headers}).subscribe({
      next: (data) => {
        this.units = data;

        this.getClasses();
      },
      error: (error) => {
        this.openSnackBar('Błąd pobierania danych o jednostkach.', 'OK');
      }
    });
  }

  private getClasses() {
    const headers = this.setHeaderAuthorization();

    this.http.get<any[]>('/api/School/Classes', {headers}).subscribe({
      next: (data) => {
        this.classes = data;

        this.sortClassesByUnit();
      },
      error: (error) => {
        this.openSnackBar('Błąd pobierania danych o oddziałach.', 'OK');
      }
    });
  }

  private sortClassesByUnit() {
    if (this.units.length > 0 && this.classes.length > 0) {
      this.classes = this.classes.map(clas => {
        clas.unit = this.units.find(unit => unit.id === clas.unit.id);

        return clas;
      });

      this.classes.sort((a, b) => {
        if (a.unit && b.unit) {
          return a.unit.short.localeCompare(b.unit.short);
        }

        return 0;
      });
    }
  }

  getClassesForUnit(unitId: number) {
    return this.classes.filter(c => c.unit?.id === unitId);
  }
}
