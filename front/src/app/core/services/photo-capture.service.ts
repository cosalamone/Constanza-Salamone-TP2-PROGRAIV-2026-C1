import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class PhotoCaptureService {
  private _resolve: ((value: string | null) => void) | null = null;

  public capturePhoto(): Promise<string | null> {
    return new Promise((resolve) => {
      this._resolve = resolve;

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';

      input.onchange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) {
          this._resolve?.(null);
          this._cleanup(input);
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          this._resolve?.(reader.result as string);
          this._cleanup(input);
        };
        reader.onerror = () => {
          this._resolve?.(null);
          this._cleanup(input);
        };
        reader.readAsDataURL(file);
      };

      input.oncancel = () => {
        this._resolve?.(null);
        this._cleanup(input);
      };

      document.body.appendChild(input);
      input.click();
    });
  }

  private _cleanup(input: HTMLInputElement): void {
    input.value = '';
    document.body.removeChild(input);
    this._resolve = null;
  }
}
