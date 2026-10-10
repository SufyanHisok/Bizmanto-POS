import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PkrPipe } from '../../../../shared/pipes/pkr.pipe';
import { BmButton } from '../../../../shared/ui/bm-button/bm-button';

export interface SplitPaymentData {
  total: number;
}

export interface SplitPaymentResult {
  cash: number;
  card: number;
}

@Component({
  selector: 'app-split-payment-dialog',
  imports: [FormsModule, MatDialogModule, BmButton, PkrPipe],
  templateUrl: './split-payment.dialog.html',
  styleUrl: './../shared-dialog.scss',
})
export class SplitPaymentDialog {
  private readonly dialogRef = inject(MatDialogRef<SplitPaymentDialog, SplitPaymentResult | undefined>);
  readonly data = inject<SplitPaymentData>(MAT_DIALOG_DATA);

  readonly cash = signal(Math.round(this.data.total / 2));
  readonly card = computed(() => Math.max(0, this.data.total - this.cash()));
  readonly error = signal('');

  onCash(value: string | number): void {
    const n = Math.max(0, Number(value) || 0);
    this.cash.set(Math.min(n, this.data.total));
  }

  cancel(): void {
    this.dialogRef.close();
  }

  pay(): void {
    if (this.cash() + this.card() !== this.data.total) {
      this.error.set('Cash + card must equal total due.');
      return;
    }
    this.dialogRef.close({ cash: this.cash(), card: this.card() });
  }
}
