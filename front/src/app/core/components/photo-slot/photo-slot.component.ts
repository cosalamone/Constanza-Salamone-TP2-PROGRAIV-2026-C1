import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-photo-slot',
  templateUrl: './photo-slot.component.html',
  styleUrls: ['./photo-slot.component.css'],
})
export class PhotoSlotComponent {
  public readonly imageUrl = input<string | null>(null);
  public readonly placeholderText = input<string>('Subir foto');
  public readonly placeholderIcon = input<string>('pi pi-camera');
  public readonly size = input<'sm' | 'md' | 'lg'>('md');
  public readonly shape = input<'square' | 'circle'>('circle');
  public readonly readonly = input<boolean>(false);

  public readonly photoClick = output<void>();

  public onClick(): void {
    if (this.readonly()) return;
    this.photoClick.emit();
  }
}
