import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInput } from "@angular/material/input";
import { MatFormField } from "@angular/material/select";
import type { Observable } from 'rxjs';
import { AuthApi } from '../../../shared/service/auth/auth.api';
import type { getMe } from '../../../shared/service/auth/auth.types';

@Component({
  selector: 'app-ustawienia',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormField,
    MatInput,
      FormsModule
],
  templateUrl: './ustawienia.component.html',
  styleUrl: './ustawienia.component.css'
})
export class UstawieniaComponent {
  getMeInfo: Observable<getMe>;

  constructor(
    authApi: AuthApi
  ) {
    this.getMeInfo = authApi.getMeInfo();
  }
}
