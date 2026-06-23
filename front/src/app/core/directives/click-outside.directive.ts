import { Directive, ElementRef, HostListener, output, inject } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  readonly clickOutside = output<void>();
  private readonly el = inject(ElementRef<HTMLElement>);

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target as HTMLElement)) {
      this.clickOutside.emit();
    }
  }
}
