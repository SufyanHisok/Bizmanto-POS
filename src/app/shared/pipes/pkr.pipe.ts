import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pkr' })
export class PkrPipe implements PipeTransform {
  transform(value: number | null | undefined, decimals = 0): string {
    const amount = Number(value ?? 0);
    const formatted = amount.toLocaleString('en-PK', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `Rs ${formatted}`;
  }
}
