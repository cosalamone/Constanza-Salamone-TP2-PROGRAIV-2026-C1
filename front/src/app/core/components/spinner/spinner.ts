import { Component, input } from '@angular/core';

export type SpinnerSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-spinner',
  standalone: true,
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
})
export class SpinnerComponent {
  size = input<SpinnerSize>('medium');
  overlay = input<boolean>(false);
  text = input<string>('');
}
