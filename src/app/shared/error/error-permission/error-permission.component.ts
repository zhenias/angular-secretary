import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-error-permission',
  imports: [
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './error-permission.component.html',
})
export class ErrorPermissionComponent {

}
