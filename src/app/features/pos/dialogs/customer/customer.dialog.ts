import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../../../../core/models/pos.models';
import { PkrPipe } from '../../../../shared/pipes/pkr.pipe';
import { BmButton } from '../../../../shared/ui/bm-button/bm-button';

const DEMO_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Walk-in Customer', phone: '—', balance: 0, city: '—' },
  { id: 'c2', name: 'Ayesha Embroidery', phone: '0300-1234567', balance: 4200, city: 'Karachi' },
  { id: 'c3', name: 'Hassan Traders', phone: '0321-7654321', balance: 0, city: 'Lahore' },
  { id: 'c4', name: 'Noor Boutique', phone: '0333-9988776', balance: 12500, city: 'Faisalabad' },
  { id: 'c5', name: 'Ali Mini Mart', phone: '0345-1122334', balance: 850, city: 'Rawalpindi' },
];

export interface CustomerDialogData {
  selected: Customer | null;
}

@Component({
  selector: 'app-customer-dialog',
  imports: [FormsModule, MatDialogModule, BmButton, PkrPipe],
  templateUrl: './customer.dialog.html',
  styleUrl: './../shared-dialog.scss',
})
export class CustomerDialog {
  private readonly dialogRef = inject(MatDialogRef<CustomerDialog, Customer | null | undefined>);
  readonly data = inject<CustomerDialogData>(MAT_DIALOG_DATA);

  query = '';
  readonly querySignal = signal('');

  readonly filtered = computed(() => {
    const q = this.querySignal().trim().toLowerCase();
    if (!q) return DEMO_CUSTOMERS;
    return DEMO_CUSTOMERS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.city?.toLowerCase().includes(q) ?? false),
    );
  });

  onQuery(value: string): void {
    this.query = value;
    this.querySignal.set(value);
  }

  select(customer: Customer): void {
    this.dialogRef.close(customer);
  }

  clear(): void {
    this.dialogRef.close(null);
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }
}
