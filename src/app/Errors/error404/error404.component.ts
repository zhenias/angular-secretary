import { Component } from '@angular/core';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-error404',
  imports: [
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.css'
})
export class Error404Component {

}
