import { Component, input, output } from '@angular/core';

export type BmButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'cash' | 'soft';
export type BmButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bm-button',
  template: `
    <button
      class="bm-btn"
      [class]="'bm-btn--' + variant() + ' bm-btn--' + size()"
      [class.bm-btn--block]="block()"
      [disabled]="disabled()"
      [type]="type()"
      (click)="pressed.emit($event)"
    >
      <ng-content />
    </button>
  `,
  styles: `
    .bm-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      border: 1px solid transparent;
      border-radius: var(--bm-radius-sm);
      font-weight: 500;
      letter-spacing: 0.01em;
      cursor: pointer;
      transition:
        background 0.15s ease,
        border-color 0.15s ease,
        color 0.15s ease,
        transform 0.1s ease;
      white-space: nowrap;
      line-height: 1.2;
    }

    .bm-btn:active:not(:disabled) {
      transform: translateY(1px);
    }

    .bm-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .bm-btn--sm {
      height: 34px;
      padding: 0 0.85rem;
      font-size: 0.8125rem;
    }

    .bm-btn--md {
      height: 42px;
      padding: 0 1.1rem;
      font-size: 0.875rem;
    }

    .bm-btn--lg {
      height: 52px;
      padding: 0 1.35rem;
      font-size: 0.95rem;
    }

    .bm-btn--block {
      width: 100%;
    }

    .bm-btn--primary {
      background: var(--bm-button);
      color: #fff;
    }

    .bm-btn--primary:hover:not(:disabled) {
      background: var(--bm-button-hover);
    }

    .bm-btn--cash {
      background: var(--bm-primary);
      color: #fff;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(44, 19, 56, 0.28);
    }

    .bm-btn--cash:hover:not(:disabled) {
      background: var(--bm-primary-mid);
    }

    .bm-btn--secondary {
      background: var(--bm-surface);
      color: var(--bm-ink);
      border-color: var(--bm-line-strong);
    }

    .bm-btn--secondary:hover:not(:disabled) {
      background: var(--bm-canvas-2);
    }

    .bm-btn--soft {
      background: var(--bm-primary-soft-2);
      color: var(--bm-primary);
    }

    .bm-btn--soft:hover:not(:disabled) {
      background: #e4d4f5;
    }

    .bm-btn--ghost {
      background: transparent;
      color: var(--bm-ink-2);
      border-color: transparent;
    }

    .bm-btn--ghost:hover:not(:disabled) {
      background: var(--bm-canvas-2);
    }

    .bm-btn--danger {
      background: var(--bm-danger-soft);
      color: var(--bm-danger);
      border-color: #f5c6cb;
    }

    .bm-btn--danger:hover:not(:disabled) {
      background: #fad7d7;
    }
  `,
})
export class BmButton {
  readonly variant = input<BmButtonVariant>('primary');
  readonly size = input<BmButtonSize>('md');
  readonly block = input(false);
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit'>('button');
  readonly pressed = output<MouseEvent>();
}
