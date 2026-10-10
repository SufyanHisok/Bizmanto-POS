export type UnitType = 'Piece' | 'Carton' | 'Dozen' | 'Meter' | 'Yard' | 'Kg' | 'Pack';

export type SaleMode = 'sale' | 'return';

export interface Product {
  id: string;
  sku: string;
  name: string;
  barcode?: string;
  unit: UnitType;
  price: number;
  cost?: number;
  stock: number;
  category?: string;
}

export interface CartLine {
  id: string;
  productId: string;
  name: string;
  sku: string;
  unit: UnitType;
  qty: number;
  rate: number;
  discount: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  balance: number;
  city?: string;
}

export interface HeldSale {
  id: string;
  label: string;
  heldAt: Date;
  lines: CartLine[];
  customer: Customer | null;
  note?: string;
}

export interface TerminalSession {
  terminalName: string;
  dayOpen: boolean;
  dayOpenedAt: Date | null;
  cashInDrawer: number;
  invoiceNo: number;
}

export interface DashboardStats {
  todaySales: number;
  todayTxns: number;
  cashSales: number;
  cardSales: number;
  avgTicket: number;
  itemsSold: number;
  returnsToday: number;
  lowStockCount: number;
}

export interface RecentSale {
  id: string;
  invoiceNo: string;
  time: string;
  customer: string;
  amount: number;
  method: 'Cash' | 'Card' | 'Split' | 'Credit';
}

export interface LowStockItem {
  name: string;
  sku: string;
  stock: number;
  unit: UnitType;
}
