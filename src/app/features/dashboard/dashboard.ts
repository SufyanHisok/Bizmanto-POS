import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { PosCartService } from '../../core/services/pos-cart.service';
import { PkrPipe } from '../../shared/pipes/pkr.pipe';
import { BmButton } from '../../shared/ui/bm-button/bm-button';

@Component({
  selector: 'app-dashboard',
  imports: [PkrPipe, BmButton],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly auth = inject(AuthService);
  private readonly dashboard = inject(DashboardService);
  private readonly cart = inject(PosCartService);

  readonly stats = this.dashboard.stats;
  readonly recentSales = this.dashboard.recentSales;
  readonly lowStock = this.dashboard.lowStock;
  readonly topItems = this.dashboard.topItems;
  readonly terminal = this.cart.terminal;
  readonly userName = computed(() => this.auth.user()?.name ?? 'User');

  openPosWindow(): void {
    const url = `${window.location.origin}/pos`;
    window.open(url, 'bizmanto-pos', 'noopener,noreferrer');
  }
}
