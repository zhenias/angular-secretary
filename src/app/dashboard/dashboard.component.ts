import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {AppComponent} from '../app.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent extends AppComponent {
  constructor() {
    super();
  }
}
