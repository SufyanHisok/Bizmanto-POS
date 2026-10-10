import { Injectable, signal } from '@angular/core';
import { DashboardStats, LowStockItem, RecentSale } from '../models/pos.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  readonly stats = signal<DashboardStats>({
    todaySales: 186450,
    todayTxns: 74,
    cashSales: 124800,
    cardSales: 61650,
    avgTicket: 2520,
    itemsSold: 312,
    returnsToday: 3,
    lowStockCount: 5,
  });

  readonly recentSales = signal<RecentSale[]>([
    { id: '1', invoiceNo: 'INV-1041', time: '4:52 PM', customer: 'Walk-in', amount: 1850, method: 'Cash' },
    { id: '2', invoiceNo: 'INV-1040', time: '4:41 PM', customer: 'Ayesha Embroidery', amount: 12400, method: 'Card' },
    { id: '3', invoiceNo: 'INV-1039', time: '4:28 PM', customer: 'Walk-in', amount: 420, method: 'Cash' },
    { id: '4', invoiceNo: 'INV-1038', time: '4:12 PM', customer: 'Hassan Traders', amount: 8900, method: 'Split' },
    { id: '5', invoiceNo: 'INV-1037', time: '3:55 PM', customer: 'Walk-in', amount: 760, method: 'Cash' },
    { id: '6', invoiceNo: 'INV-1036', time: '3:40 PM', customer: 'Noor Boutique', amount: 15600, method: 'Credit' },
  ]);

  readonly lowStock = signal<LowStockItem[]>([
    { name: 'Sequins Mixed Pack', sku: 'EMB-088', stock: 8, unit: 'Pack' },
    { name: 'Lux Soap Carton (12)', sku: 'SOAP-12', stock: 15, unit: 'Carton' },
    { name: 'Basmati Rice 10kg', sku: 'RICE-10', stock: 22, unit: 'Pack' },
    { name: 'Zari Lace Roll 9 Yard', sku: 'EMB-014', stock: 48, unit: 'Yard' },
    { name: 'Sugar 5kg', sku: 'SUG-5', stock: 28, unit: 'Pack' },
  ]);

  readonly topItems = signal(
    [
      { name: 'Tea Whitener 200ml', qty: 48, amount: 4560 },
      { name: 'Embroidery Thread — Golden', qty: 36, amount: 3060 },
      { name: 'Lays Classic 30g', qty: 55, amount: 3300 },
      { name: 'Lawn Fabric — Soft White', qty: 22, amount: 9900 },
    ] as const,
  );
}
