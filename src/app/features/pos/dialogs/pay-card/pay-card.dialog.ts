import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PkrPipe } from '../../../../shared/pipes/pkr.pipe';
import { BmButton } from '../../../../shared/ui/bm-button/bm-button';

export interface PayCardData {
  total: number;
}

export interface PayCardResult {
  reference: string;
  bank: string;
}

@Component({
  selector: 'app-pay-card-dialog',
  imports: [FormsModule, MatDialogModule, BmButton, PkrPipe],
  templateUrl: './pay-card.dialog.html',
  styleUrl: './../shared-dialog.scss',
})
export class PayCardDialog {
  private readonly dialogRef = inject(MatDialogRef<PayCardDialog, PayCardResult | undefined>);
  readonly data = inject<PayCardData>(MAT_DIALOG_DATA);

  bank = 'HBL';
  reference = '';
  readonly error = signal('');

  cancel(): void {
    this.dialogRef.close();
  }

  pay(): void {
    if (!this.reference.trim()) {
      this.error.set('Enter card / machine reference.');
      return;
    }
    this.dialogRef.close({ reference: this.reference.trim(), bank: this.bank });
  }
}
