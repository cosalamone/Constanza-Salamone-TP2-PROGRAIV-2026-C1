import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText',
  standalone: true,
})
export class TruncateTextPipe implements PipeTransform {
  transform(value: string | null | undefined, limit: number = 100): string {
    if (!value || value.length <= limit) return value || '';
    return value.substring(0, limit).trimEnd() + '...';
  }
}
