import { Component, inject, computed, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { PhotoSlotComponent } from '../photo-slot/photo-slot.component';
import { PublicationServices } from '../../../services/publication/publication.services';
import { PhotoCaptureService } from '../../../core/services/photo-capture.service';
import { compressImage } from '../../../core/utils/image-compression';

@Component({
  selector: 'app-create-post-form',
  standalone: true,
  imports: [PhotoSlotComponent, ReactiveFormsModule],
  templateUrl: './create-post-form.html',
  styleUrls: ['./create-post-form.css'],
})
export class CreatePostFormComponent {
  private readonly _authService = inject(AuthService);
  private readonly _fb = inject(FormBuilder);
  private readonly _publicationService = inject(PublicationServices);
  private readonly _photoCaptureService = inject(PhotoCaptureService);

  publicationCreated = output<void>();

  public readonly user = computed(() => this._authService.currentUser());
  public readonly imagePreview = signal<string | null>(null);

  public readonly form = this._fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
  });

  public async handlePhotoClick(): Promise<void> {
    const dataUrl = await this._photoCaptureService.capturePhoto();
    if (dataUrl) {
      const compressed = await compressImage(dataUrl);
      this.imagePreview.set(compressed);
    }
  }

  public removeImage(): void {
    this.imagePreview.set(null);
  }

  public onSubmit(): void {
    if (this.form.invalid || !this.user()) return;

    const userId = this.user()!.id;
    this._publicationService.createPublication({
      title: this.form.value.title ?? '',
      description: this.form.value.description ?? '',
      imageUrl: this.imagePreview() ?? undefined,
      userId,
    }).subscribe(() => {
      this.form.reset();
      this.imagePreview.set(null);
      this.publicationCreated.emit();
    });
  }
}
