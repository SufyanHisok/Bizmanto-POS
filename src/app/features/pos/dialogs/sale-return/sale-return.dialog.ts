import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BmButton } from '../../../../shared/ui/bm-button/bm-button';

export interface SaleReturnResult {
  invoiceNo: string;
  reason: string;
}

@Component({
  selector: 'app-sale-return-dialog',
  imports: [FormsModule, MatDialogModule, BmButton],
  templateUrl: './sale-return.dialog.html',
  styleUrl: './../shared-dialog.scss',
})
export class SaleReturnDialog {
  private readonly dialogRef = inject(MatDialogRef<SaleReturnDialog, SaleReturnResult | undefined>);

  invoiceNo = '';
  reason = 'Customer return';
  readonly error = signal('');

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    if (!this.invoiceNo.trim()) {
      this.error.set('Enter the original invoice number.');
      return;
    }
    this.dialogRef.close({
      invoiceNo: this.invoiceNo.trim(),
      reason: this.reason,
    });
  }
}
