import { Component } from '@angular/core';
import {MatProgressBar, MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-loading-html',
  imports: [
    MatProgressBarModule
  ],
  templateUrl: './loading-html.component.html',
  styleUrl: './loading-html.component.css'
})
export class LoadingHTMLComponent {

}
