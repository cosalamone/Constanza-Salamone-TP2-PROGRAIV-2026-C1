import { Directive, ElementRef, OnInit, inject, input } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements OnInit {
  readonly delay = input<number>(0);
  private readonly el = inject(ElementRef<HTMLElement>);

  public ngOnInit(): void {
    setTimeout(() => this.el.nativeElement.focus(), this.delay());
  }
}
