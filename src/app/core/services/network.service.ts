import { Injectable, OnDestroy, signal } from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NetworkService implements OnDestroy {
  private readonly onlineSignal = signal(typeof navigator !== 'undefined' ? navigator.onLine : true);
  private sub?: Subscription;

  readonly online = this.onlineSignal.asReadonly();

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    this.sub = merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false)),
    )
      .pipe(startWith(navigator.onLine))
      .subscribe((status) => this.onlineSignal.set(status));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
