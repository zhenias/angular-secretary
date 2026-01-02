import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {PreloadAllModules, provideRouter, withPreloading} from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter} from '@angular/material/core';
import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient} from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {provideQuillConfig} from 'ngx-quill';

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

export const TOOLBAR_QUILL = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],

  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  //[{ 'color': [] }, { 'background': [] }],
  //[{ 'font': [] }],
  [{ 'align': [] }],

  ['clean'],
];
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true
    }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
    ),
    provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom([
      MatSnackBarModule,
      MatDatepickerModule,
      MatDialogModule
    ]),
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    provideQuillConfig({
      sanitize: true,
      modules: {
        toolbar: TOOLBAR_QUILL,
      },
      theme: 'snow',
      placeholder: 'Utwórz dokument do szablonu...',
    })
  ],
};
