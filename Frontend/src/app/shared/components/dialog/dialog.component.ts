// dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  imports: [MatDialogActions, MatDialogContent, MatButtonModule],
  standalone: true,
})
export class DialogComponent {
  _header: string;
  _content: string;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { header?: string; content?: string }
  ) {
    this._header = data.header || 'Are you sure ?';
    this._content = data.content || 'Do you want to do your action ?';
  }

  // Action for 'Close' button
  onClose(): void {
    this.dialogRef.close(); // Close the dialog without any data
  }

  // Action for 'Agree' button
  onAgree(): void {
    this.dialogRef.close(true); // Close the dialog with an agreement action
  }
}
