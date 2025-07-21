import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

export interface ColumnProfile {
  name: string;
  visible: number;
  order: number;
  label?: string;
}

@Component({
  selector: 'app-profile-settings',
  imports: [
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    NgForOf,
    MatDialogModule
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent {
  public columns: ColumnProfile[] = [
    {
      name: '',
      visible: 0,
      order: 0,
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<ProfileSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { columns: ColumnProfile[] }
  ) {
    this.columns = [...this.data.columns];
  }

  save() {
    localStorage.setItem('studentColumnProfile', JSON.stringify(this.columns));

    this.dialogRef.close(this.columns);
  }

  toggleVisibility(col: ColumnProfile) {
    col.visible = Number(!col.visible);
  }

  moveUp(index: number) {
    if (index > 0) {
      [this.columns[index], this.columns[index - 1]] = [this.columns[index - 1], this.columns[index]];
    }
  }

  moveDown(index: number) {
    if (index < this.columns.length - 1) {
      [this.columns[index], this.columns[index + 1]] = [this.columns[index + 1], this.columns[index]];
    }
  }
}
