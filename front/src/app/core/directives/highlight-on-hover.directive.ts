import { Directive, ElementRef, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appHighlightOnHover]',
  standalone: true,
})
export class HighlightOnHoverDirective {
  public readonly highlightColor = input<string>('rgba(64, 224, 198, 0.08)');

  constructor(private readonly _el: ElementRef<HTMLElement>) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this._el.nativeElement.style.backgroundColor = this.highlightColor();
    this._el.nativeElement.style.transition = 'background-color 200ms ease';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this._el.nativeElement.style.backgroundColor = '';
  }
}
