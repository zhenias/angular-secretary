import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import {DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter} from '@angular/material/core';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'yyyy-MM-dd'
  },
  display: {
    dateInput: 'yyyy-MM-dd',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'yyyy-MM-dd',
    monthYearA11yLabel: 'MMMM yyyy'
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true
    }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    {
      provide: DateAdapter,
      useClass: NativeDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'pl-PL'
    },
    importProvidersFrom([
      MatSnackBarModule,
      MatDatepickerModule,
      MatDialogModule,
    ])
  ],
};
