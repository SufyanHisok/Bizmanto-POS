import { Component, inject, input, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  action?: 'pos' | 'logout';
  accent?: boolean;
}

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly collapsed = input(false);
  readonly openPos = output<void>();
  readonly navigate = output<void>();

  readonly items: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Open POS', icon: 'point_of_sale', action: 'pos', accent: true },
    { label: 'Sales', icon: 'receipt_long', route: '/dashboard' },
    { label: 'Products', icon: 'inventory_2', route: '/dashboard' },
    { label: 'Customers', icon: 'group', route: '/dashboard' },
    { label: 'Reports', icon: 'insights', route: '/dashboard' },
  ];

  readonly user = this.auth.user;

  onItem(item: NavItem): void {
    if (item.action === 'pos') {
      this.openPos.emit();
      return;
    }
    this.navigate.emit();
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
