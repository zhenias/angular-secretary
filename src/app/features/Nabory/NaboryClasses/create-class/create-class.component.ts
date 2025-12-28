import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {
  createNaboryClass,
  createNaboryClassesInterface
} from '../../../../shared/service/core/secretariat/nabory/classes';
import {AppComponent} from '../../../../app.component';
import {getUnits} from '../../../../shared/service/core/secretariat/units';
import {UnitInterface} from '../../../Student/students.types';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-create-class',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgForOf,
  ],
  templateUrl: './create-class.component.html',
  standalone: true
})
export class CreateClassComponent extends AppComponent {
  public buildFetch: createNaboryClassesInterface = {
    level: 1,
    symbol: '',
    id_jednostka: 0
  };
  public unitsList: UnitInterface[] = [];

  constructor() {
    super();

    this.getUnitsList();
  }

  async createClass(): Promise<void> {
    await createNaboryClass(this.buildFetch);
  }

  async getUnitsList(): Promise<void> {
    this.unitsList = await getUnits();
  }
}
