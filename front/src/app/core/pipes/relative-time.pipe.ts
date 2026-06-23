import { Pipe, PipeTransform } from '@angular/core';
import { TimeAgoPipe } from './time-ago.pipe';
import { FormatDatePipe } from './format-date.pipe';

@Pipe({
  name: 'relativeTime',
  standalone: true,
})
export class RelativeTimePipe implements PipeTransform {
  private readonly timeAgoPipe = new TimeAgoPipe();
  private readonly formatDatePipe = new FormatDatePipe();

  transform(value: Date | string | null | undefined, thresholdDays: number = 6): string {
    if (!value) return '';

    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const thresholdMs = thresholdDays * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const diff = now - date.getTime();

    if (diff < thresholdMs) {
      return this.timeAgoPipe.transform(value);
    }

    return this.formatDatePipe.transform(value, 'short');
  }
}
