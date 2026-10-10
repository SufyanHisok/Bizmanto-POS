import { Injectable, computed, signal } from '@angular/core';
import {
  CartLine,
  Customer,
  HeldSale,
  Product,
  SaleMode,
  TerminalSession,
  UnitType,
} from '../models/pos.models';

@Injectable({ providedIn: 'root' })
export class PosCartService {
  private readonly linesSignal = signal<CartLine[]>([]);
  private readonly customerSignal = signal<Customer | null>(null);
  private readonly modeSignal = signal<SaleMode>('sale');
  private readonly heldSignal = signal<HeldSale[]>([]);
  private readonly noteSignal = signal('');
  private readonly terminalSignal = signal<TerminalSession>({
    terminalName: 'Counter-01',
    dayOpen: true,
    dayOpenedAt: new Date(),
    cashInDrawer: 12500,
    invoiceNo: 1042,
  });

  readonly lines = this.linesSignal.asReadonly();
  readonly customer = this.customerSignal.asReadonly();
  readonly mode = this.modeSignal.asReadonly();
  readonly heldSales = this.heldSignal.asReadonly();
  readonly note = this.noteSignal.asReadonly();
  readonly terminal = this.terminalSignal.asReadonly();

  readonly itemCount = computed(() =>
    this.linesSignal().reduce((sum, line) => sum + line.qty, 0),
  );

  readonly subtotal = computed(() =>
    this.linesSignal().reduce((sum, line) => sum + line.qty * line.rate, 0),
  );

  readonly discountTotal = computed(() =>
    this.linesSignal().reduce((sum, line) => sum + line.discount, 0),
  );

  readonly grandTotal = computed(() =>
    Math.max(0, this.subtotal() - this.discountTotal()),
  );

  setMode(mode: SaleMode): void {
    this.modeSignal.set(mode);
  }

  setCustomer(customer: Customer | null): void {
    this.customerSignal.set(customer);
  }

  setNote(note: string): void {
    this.noteSignal.set(note);
  }

  addProduct(product: Product, qty = 1): void {
    const existing = this.linesSignal().find((l) => l.productId === product.id && l.unit === product.unit);
    if (existing) {
      this.updateQty(existing.id, existing.qty + qty);
      return;
    }

    const line: CartLine = {
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      sku: product.sku,
      unit: product.unit,
      qty,
      rate: product.price,
      discount: 0,
    };
    this.linesSignal.update((lines) => [...lines, line]);
  }

  updateQty(lineId: string, qty: number): void {
    const next = Math.max(0, qty);
    if (next === 0) {
      this.removeLine(lineId);
      return;
    }
    this.linesSignal.update((lines) =>
      lines.map((l) => (l.id === lineId ? { ...l, qty: next } : l)),
    );
  }

  updateRate(lineId: string, rate: number): void {
    this.linesSignal.update((lines) =>
      lines.map((l) => (l.id === lineId ? { ...l, rate: Math.max(0, rate) } : l)),
    );
  }

  updateUnit(lineId: string, unit: UnitType): void {
    this.linesSignal.update((lines) =>
      lines.map((l) => (l.id === lineId ? { ...l, unit } : l)),
    );
  }

  updateDiscount(lineId: string, discount: number): void {
    this.linesSignal.update((lines) =>
      lines.map((l) => {
        if (l.id !== lineId) return l;
        const max = l.qty * l.rate;
        return { ...l, discount: Math.min(Math.max(0, discount), max) };
      }),
    );
  }

  removeLine(lineId: string): void {
    this.linesSignal.update((lines) => lines.filter((l) => l.id !== lineId));
  }

  clearCart(): void {
    this.linesSignal.set([]);
    this.customerSignal.set(null);
    this.noteSignal.set('');
    this.modeSignal.set('sale');
  }

  holdSale(label?: string): void {
    const lines = this.linesSignal();
    if (!lines.length) return;

    const held: HeldSale = {
      id: crypto.randomUUID(),
      label: label?.trim() || `Hold #${this.heldSignal().length + 1}`,
      heldAt: new Date(),
      lines: structuredClone(lines),
      customer: this.customerSignal(),
      note: this.noteSignal(),
    };
    this.heldSignal.update((list) => [held, ...list]);
    this.clearCart();
  }

  recallSale(id: string): void {
    const held = this.heldSignal().find((h) => h.id === id);
    if (!held) return;
    this.linesSignal.set(structuredClone(held.lines));
    this.customerSignal.set(held.customer);
    this.noteSignal.set(held.note ?? '');
    this.heldSignal.update((list) => list.filter((h) => h.id !== id));
  }

  completeSale(): number {
    const invoice = this.terminalSignal().invoiceNo;
    this.terminalSignal.update((t) => ({
      ...t,
      invoiceNo: t.invoiceNo + 1,
      cashInDrawer: t.cashInDrawer + this.grandTotal(),
    }));
    this.clearCart();
    return invoice;
  }

  lineAmount(line: CartLine): number {
    return Math.max(0, line.qty * line.rate - line.discount);
  }
}
