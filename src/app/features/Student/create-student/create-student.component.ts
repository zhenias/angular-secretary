import {Component, ViewChild} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {formatDate, NgIf} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AppComponent} from '../../../app.component';
import {HttpClient} from '@angular/common/http';
import {CreateStudent} from '../students.types';

@Component({
  selector: 'app-create-student',
  standalone: true,
  imports: [
    MatStepperModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    CdkStepperModule,
    NgIf,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    FormsModule,
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './create-student.component.html',
})
export class CreateStudentComponent extends AppComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  private createStudent?: CreateStudent;

  protected readonly formatDate = formatDate;

  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    super();

    this.firstFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email]],
      pesel: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      birthDate: [''],
      educationType: [''],
      plec: ['', Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      addressResidence: [''],
      addressRegistration: [''],
      numberPhone: ['', Validators.pattern(/^\d{9}$/)]
    });
  }

  get isLastStep(): boolean {
    return this.stepper ? this.stepper.selectedIndex === this.stepper.steps.length - 1 : false;
  }

  get isFirstStep(): boolean {
    return this.stepper ? this.stepper.selectedIndex === 0 : false;
  }

  get actualBirth(): string | undefined {
    return this.firstFormGroup.get('birthDate')?.value ? formatDate(this.firstFormGroup.get('birthDate')?.value, 'Y-MM-dd', 'en') : undefined;
  }

  public getCreateStudentFetch(): void {
    this.createStudent = {
      user_name: this.firstFormGroup.get('firstName')?.value,
      user_lastname: this.firstFormGroup.get('lastName')?.value,
      email: this.firstFormGroup.get('email')?.value,
      pesel: this.firstFormGroup.get('pesel')?.value,
      data_urodzenia: this.actualBirth,
      typ_nauczania: this.firstFormGroup.get('educationType')?.value,
      adres_zamieszkania: this.secondFormGroup.get('addressResidence')?.value,
      adres_zameldowania: this.secondFormGroup.get('addressRegistration')?.value,
      plec: this.firstFormGroup.get('plec')?.value,
    };

    const headers = this.setHeaderAuthorization();

    this.http.post<any[]>('/api/School/Students', this.createStudent, {headers}).subscribe({
      next: (data) => {
        this.openSnackBar('Uczeń został dodany do bazy szkoły.', 'OK');
      },
      error: (error) => {
        switch (error.error.error) {
          case 'Create account conflict.':
            this.openSnackBar('Uczeń nie został dodany. Wewnętrzny konflikt, lub wystąpiły sprzeczności.', 'OK');
            break;
          default:
            this.openSnackBar('Wystąpił błąd.', 'OK');
        }
      }
    });
  }
}
