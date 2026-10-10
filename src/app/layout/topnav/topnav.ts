import { Component, inject, output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NetworkService } from '../../core/services/network.service';
import { PosCartService } from '../../core/services/pos-cart.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.html',
  styleUrl: './topnav.scss',
})
export class Topnav {
  private readonly auth = inject(AuthService);
  private readonly network = inject(NetworkService);
  private readonly cart = inject(PosCartService);

  readonly menuClick = output<void>();
  readonly openPos = output<void>();

  readonly user = this.auth.user;
  readonly online = this.network.online;
  readonly terminal = this.cart.terminal;
}
