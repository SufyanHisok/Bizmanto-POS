import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HeldSale } from '../../../../core/models/pos.models';
import { PkrPipe } from '../../../../shared/pipes/pkr.pipe';
import { BmButton } from '../../../../shared/ui/bm-button/bm-button';

export interface HoldRecallData {
  held: HeldSale[];
  canHold: boolean;
}

export type HoldRecallResult =
  | { action: 'hold'; label: string }
  | { action: 'recall'; id: string };

@Component({
  selector: 'app-hold-recall-dialog',
  imports: [FormsModule, MatDialogModule, BmButton, PkrPipe, DatePipe],
  templateUrl: './hold-recall.dialog.html',
  styleUrl: './../shared-dialog.scss',
})
export class HoldRecallDialog {
  private readonly dialogRef = inject(MatDialogRef<HoldRecallDialog, HoldRecallResult | undefined>);
  readonly data = inject<HoldRecallData>(MAT_DIALOG_DATA);

  label = '';

  holdAmount(held: HeldSale): number {
    return held.lines.reduce((sum, l) => sum + Math.max(0, l.qty * l.rate - l.discount), 0);
  }

  hold(): void {
    if (!this.data.canHold) return;
    this.dialogRef.close({ action: 'hold', label: this.label.trim() });
  }

  recall(id: string): void {
    this.dialogRef.close({ action: 'recall', id });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
