import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PkrPipe } from '../../../../shared/pipes/pkr.pipe';
import { BmButton } from '../../../../shared/ui/bm-button/bm-button';

export interface PayCashData {
  total: number;
}

export interface PayCashResult {
  tendered: number;
  change: number;
}

@Component({
  selector: 'app-pay-cash-dialog',
  imports: [FormsModule, MatDialogModule, BmButton, PkrPipe],
  templateUrl: './pay-cash.dialog.html',
  styleUrl: './pay-cash.dialog.scss',
})
export class PayCashDialog {
  private readonly dialogRef = inject(MatDialogRef<PayCashDialog, PayCashResult | undefined>);
  readonly data = inject<PayCashData>(MAT_DIALOG_DATA);

  readonly tendered = signal(this.data.total);
  readonly change = computed(() => Math.max(0, this.tendered() - this.data.total));
  readonly shortfall = computed(() => Math.max(0, this.data.total - this.tendered()));

  onTenderedInput(value: string): void {
    this.tendered.set(Number(value) || 0);
  }

  quickFill(amount: number): void {
    this.tendered.set(amount);
  }

  exact(): void {
    this.tendered.set(this.data.total);
  }

  nearest500(): void {
    const total = this.data.total;
    this.tendered.set(total <= 0 ? 500 : Math.ceil(total / 500) * 500);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  pay(): void {
    if (this.tendered() < this.data.total) return;
    this.dialogRef.close({ tendered: this.tendered(), change: this.change() });
  }
}
