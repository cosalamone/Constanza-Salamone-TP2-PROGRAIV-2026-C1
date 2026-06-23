import { Component, Input, signal, computed } from '@angular/core';
import { TruncateTextPipe } from '../../pipes/truncate-text.pipe';

@Component({
  selector: 'app-truncate-text',
  standalone: true,
  imports: [TruncateTextPipe],
  template: `
    @if (isTruncated()) {
      @if (expanded()) {
        <span>{{ text }}<button class="truncate-toggle" (click)="toggle()">{{ lessLabel }}</button></span>
      } @else {
        <span>{{ text | truncateText:limit }}<button class="truncate-toggle" (click)="toggle()">{{ moreLabel }}</button></span>
      }
    } @else {
      <span>{{ text }}</span>
    }
  `,
  styles: [`
    .truncate-toggle {
      background: none;
      border: none;
      color: var(--color-primary);
      cursor: pointer;
      font-size: inherit;
      padding: 0 0 0 4px;
    }
    .truncate-toggle:hover {
      text-decoration: underline;
    }
  `],
})
export class TruncateTextComponent {
  @Input() text: string | null | undefined = '';
  @Input() limit: number = 100;
  @Input() lessLabel: string = 'ver menos';
  @Input() moreLabel: string = 'ver más';

  readonly expanded = signal(false);

  readonly isTruncated = computed(() => !!(this.text && this.text.length > this.limit));

  toggle(): void {
    this.expanded.update((v) => !v);
  }
}
