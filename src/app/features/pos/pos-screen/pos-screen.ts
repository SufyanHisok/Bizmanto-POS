import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UnitType } from '../../../core/models/pos.models';
import { AuthService } from '../../../core/services/auth.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { NetworkService } from '../../../core/services/network.service';
import { PosCartService } from '../../../core/services/pos-cart.service';
import { PkrPipe } from '../../../shared/pipes/pkr.pipe';
import { BmButton } from '../../../shared/ui/bm-button/bm-button';
import { CustomerDialog } from '../dialogs/customer/customer.dialog';
import { HoldRecallDialog } from '../dialogs/hold-recall/hold-recall.dialog';
import { PayCardDialog } from '../dialogs/pay-card/pay-card.dialog';
import { PayCashDialog } from '../dialogs/pay-cash/pay-cash.dialog';
import { SaleReturnDialog } from '../dialogs/sale-return/sale-return.dialog';
import { SplitPaymentDialog } from '../dialogs/split-payment/split-payment.dialog';

const UNITS: UnitType[] = ['Piece', 'Carton', 'Dozen', 'Meter', 'Yard', 'Kg', 'Pack'];

@Component({
  selector: 'app-pos-screen',
  imports: [FormsModule, MatDialogModule, DatePipe, PkrPipe, BmButton],
  templateUrl: './pos-screen.html',
  styleUrl: './pos-screen.scss',
})
export class PosScreen {
  private readonly auth = inject(AuthService);
  private readonly network = inject(NetworkService);
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(PosCartService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly units = UNITS;
  readonly menuOpen = signal(false);
  readonly toast = signal<string | null>(null);
  readonly search = signal('');
  readonly now = signal(new Date());

  readonly user = this.auth.user;
  readonly online = this.network.online;
  readonly lines = this.cart.lines;
  readonly customer = this.cart.customer;
  readonly mode = this.cart.mode;
  readonly subtotal = this.cart.subtotal;
  readonly discountTotal = this.cart.discountTotal;
  readonly grandTotal = this.cart.grandTotal;
  readonly itemCount = this.cart.itemCount;
  readonly terminal = this.cart.terminal;
  readonly heldCount = computed(() => this.cart.heldSales().length);

  readonly suggestions = computed(() => {
    const q = this.search().trim();
    if (q.length < 1) return [];
    return this.catalog.search(q).slice(0, 8);
  });

  constructor() {
    setInterval(() => this.now.set(new Date()), 30_000);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  goBackToApp(): void {
    this.closeMenu();
    void this.router.navigateByUrl('/dashboard');
  }

  onSearchKey(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const q = this.search().trim();
    if (!q) return;

    const exact = this.catalog.findByBarcodeOrSku(q) ?? this.suggestions()[0];
    if (exact) {
      this.addProduct(exact.id);
      this.search.set('');
    }
  }

  addProduct(productId: string): void {
    const product = this.catalog.products().find((p) => p.id === productId);
    if (!product) return;
    this.cart.addProduct(product);
    this.search.set('');
    this.showToast(`Added ${product.name}`);
  }

  updateQty(lineId: string, value: string | number): void {
    this.cart.updateQty(lineId, Number(value) || 0);
  }

  updateRate(lineId: string, value: string | number): void {
    this.cart.updateRate(lineId, Number(value) || 0);
  }

  updateDiscount(lineId: string, value: string | number): void {
    this.cart.updateDiscount(lineId, Number(value) || 0);
  }

  updateUnit(lineId: string, unit: UnitType): void {
    this.cart.updateUnit(lineId, unit);
  }

  removeLine(lineId: string): void {
    this.cart.removeLine(lineId);
  }

  lineAmount(lineId: string): number {
    const line = this.lines().find((l) => l.id === lineId);
    return line ? this.cart.lineAmount(line) : 0;
  }

  setSaleMode(): void {
    this.cart.setMode('sale');
    this.showToast('Sale mode');
  }

  openSaleReturn(): void {
    const ref = this.dialog.open(SaleReturnDialog, {
      panelClass: 'bm-dialog-panel',
      autoFocus: 'first-tabbable',
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.cart.setMode('return');
      this.showToast(`Return mode — ${result.invoiceNo}`);
    });
  }

  openCustomer(): void {
    const ref = this.dialog.open(CustomerDialog, {
      panelClass: 'bm-dialog-panel',
      data: { selected: this.customer() },
    });
    ref.afterClosed().subscribe((result) => {
      if (result === undefined) return;
      this.cart.setCustomer(result);
      this.showToast(result ? `Customer: ${result.name}` : 'Customer cleared');
    });
  }

  openHoldRecall(): void {
    const ref = this.dialog.open(HoldRecallDialog, {
      panelClass: 'bm-dialog-panel',
      data: {
        held: this.cart.heldSales(),
        canHold: this.lines().length > 0,
      },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      if (result.action === 'hold') {
        this.cart.holdSale(result.label);
        this.showToast('Bill held');
      } else {
        this.cart.recallSale(result.id);
        this.showToast('Bill recalled');
      }
    });
  }

  clearBill(): void {
    if (!this.lines().length) return;
    this.cart.clearCart();
    this.showToast('Bill cleared');
  }

  openPayCash(): void {
    if (!this.ensureBill()) return;
    const ref = this.dialog.open(PayCashDialog, {
      panelClass: 'bm-dialog-panel',
      data: { total: this.grandTotal() },
      disableClose: true,
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const inv = this.cart.completeSale();
      this.showToast(`Cash paid · INV-${inv} · Change ${result.change.toLocaleString('en-PK')}`);
    });
  }

  openPayCard(): void {
    if (!this.ensureBill()) return;
    const ref = this.dialog.open(PayCardDialog, {
      panelClass: 'bm-dialog-panel',
      data: { total: this.grandTotal() },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const inv = this.cart.completeSale();
      this.showToast(`Card paid · INV-${inv} · Ref ${result.reference}`);
    });
  }

  openSplit(): void {
    if (!this.ensureBill()) return;
    const ref = this.dialog.open(SplitPaymentDialog, {
      panelClass: 'bm-dialog-panel',
      data: { total: this.grandTotal() },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const inv = this.cart.completeSale();
      this.showToast(`Split paid · INV-${inv}`);
    });
  }

  private ensureBill(): boolean {
    if (!this.lines().length) {
      this.showToast('Add items before payment');
      return false;
    }
    return true;
  }

  private showToast(message: string): void {
    this.toast.set(message);
    setTimeout(() => {
      if (this.toast() === message) this.toast.set(null);
    }, 2600);
  }
}
