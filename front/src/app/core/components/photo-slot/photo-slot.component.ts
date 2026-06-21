import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-photo-slot',
  templateUrl: './photo-slot.component.html',
  styleUrls: ['./photo-slot.component.css'],
})
export class PhotoSlotComponent {
  public readonly imageUrl = input<string | null>(null);
  public readonly placeholderText = input<string>('Subir foto');
  public readonly placeholderIcon = input<string>('pi pi-camera');
  public readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  public readonly shape = input<'square' | 'circle'>('circle');
  public readonly readonly = input<boolean>(false);
  public readonly name = input<string>('');
  public readonly lastName = input<string>('');

  public readonly photoClick = output<void>();

  public readonly initials = computed(() => {
    const name = this.name() ?? '';
    const lastName = this.lastName() ?? '';
    const first = name.charAt(0) || '';
    const last = lastName.charAt(0) || '';
    return (first + last).toUpperCase();
  });

  public readonly hasInitials = computed(() => this.initials().length > 0);

  public onClick(): void {
    if (this.readonly()) return;
    this.photoClick.emit();
  }
}
