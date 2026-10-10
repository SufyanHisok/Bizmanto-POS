import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from '../sidenav/sidenav';
import { Topnav } from '../topnav/topnav';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidenav, Topnav],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  readonly collapsed = signal(false);

  toggleNav(): void {
    this.collapsed.update((v) => !v);
  }

  openPosWindow(): void {
    const url = `${window.location.origin}/pos`;
    window.open(url, 'bizmanto-pos', 'noopener,noreferrer');
  }
}
