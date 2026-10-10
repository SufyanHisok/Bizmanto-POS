import { Injectable, signal } from '@angular/core';
import { Product } from '../models/pos.models';

const DEMO_PRODUCTS: Product[] = [
  { id: '1', sku: 'EMB-001', name: 'Embroidery Thread — Golden', barcode: '8901001', unit: 'Piece', price: 85, stock: 240, category: 'Embroidery' },
  { id: '2', sku: 'EMB-014', name: 'Zari Lace Roll 9 Yard', barcode: '8901014', unit: 'Yard', price: 320, stock: 48, category: 'Embroidery' },
  { id: '3', sku: 'FAB-220', name: 'Lawn Fabric — Soft White', barcode: '8901220', unit: 'Meter', price: 450, stock: 120, category: 'Fabric' },
  { id: '4', sku: 'TEA-001', name: 'Tea Whitener 200ml', barcode: '8902001', unit: 'Piece', price: 95, stock: 86, category: 'Grocery' },
  { id: '5', sku: 'TEA-002', name: 'Tapal Danedar 900g', barcode: '8902002', unit: 'Pack', price: 1450, stock: 34, category: 'Grocery' },
  { id: '6', sku: 'RICE-10', name: 'Basmati Rice 10kg', barcode: '8903010', unit: 'Pack', price: 3850, stock: 22, category: 'Grocery' },
  { id: '7', sku: 'OIL-5L', name: 'Cooking Oil 5 Litre', barcode: '8903005', unit: 'Piece', price: 2450, stock: 40, category: 'Grocery' },
  { id: '8', sku: 'SOAP-12', name: 'Lux Soap Carton (12)', barcode: '8904012', unit: 'Carton', price: 1680, stock: 15, category: 'FMCG' },
  { id: '9', sku: 'BTN-50', name: 'Shirt Buttons Pack', barcode: '8905050', unit: 'Pack', price: 120, stock: 95, category: 'Accessories' },
  { id: '10', sku: 'NDL-100', name: 'Machine Needles Box', barcode: '8905100', unit: 'Pack', price: 350, stock: 60, category: 'Accessories' },
  { id: '11', sku: 'SNK-01', name: 'Lays Classic 30g', barcode: '8906001', unit: 'Piece', price: 60, stock: 200, category: 'Snacks' },
  { id: '12', sku: 'DRK-01', name: 'Nestle Juice 200ml', barcode: '8907001', unit: 'Piece', price: 80, stock: 150, category: 'Beverages' },
  { id: '13', sku: 'EMB-088', name: 'Sequins Mixed Pack', barcode: '8901088', unit: 'Pack', price: 275, stock: 8, category: 'Embroidery' },
  { id: '14', sku: 'MILK-1L', name: 'Olpers Milk 1 Litre', barcode: '8908001', unit: 'Piece', price: 280, stock: 55, category: 'Dairy' },
  { id: '15', sku: 'SUG-5', name: 'Sugar 5kg', barcode: '8909005', unit: 'Pack', price: 780, stock: 28, category: 'Grocery' },
];

@Injectable({ providedIn: 'root' })
export class CatalogService {
  readonly products = signal<Product[]>(DEMO_PRODUCTS);

  search(query: string): Product[] {
    const q = query.trim().toLowerCase();
    if (!q) {
      return this.products();
    }
    return this.products().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.barcode?.includes(q) ?? false) ||
        (p.category?.toLowerCase().includes(q) ?? false),
    );
  }

  findByBarcodeOrSku(code: string): Product | undefined {
    const q = code.trim().toLowerCase();
    return this.products().find(
      (p) => p.barcode?.toLowerCase() === q || p.sku.toLowerCase() === q,
    );
  }
}
