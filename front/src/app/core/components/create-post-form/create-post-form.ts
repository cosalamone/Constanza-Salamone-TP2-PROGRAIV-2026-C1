import { Component, inject, computed, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { PhotoSlotComponent } from '../photo-slot/photo-slot.component';
import { PublicationServices } from '../../../services/publication/publication.services';
import { PhotoCaptureService } from '../../../core/services/photo-capture.service';
import { compressImage } from '../../../core/utils/image-compression';
import { ButtonBaseComponent } from '../buttons/button-base/button-base.component';
import { ButtonIconModel } from '../../models/buttons/icons-buttons/button-icon.model';
import { ButtonCommonModel } from '../../models/buttons/button-common.model';
import { of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-create-post-form',
  standalone: true,
  imports: [PhotoSlotComponent, ReactiveFormsModule, ButtonBaseComponent],
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

  private readonly _submitDisabledSignal = toSignal(
    this.form.statusChanges.pipe(
      startWith(this.form.status),
      map(() => this.form.invalid),
    ),
    { initialValue: this.form.invalid },
  );

  public readonly removeImageButtonModel = computed(
    () =>
      new ButtonIconModel({
        iconName: 'pi pi-times',
        action: () => this.removeImage(),
        permission: of({ allowed: true }),
        styleClass: 'create-post__remove-image',
      }),
  );

  public readonly attachPhotoButtonModel = computed(
    () =>
      new ButtonCommonModel({
        iconName: 'pi pi-image',
        label: 'Foto / video',
        style: 'outlined',
        action: () => this.handlePhotoClick(),
        permission: of({ allowed: true }),
        styleClass: 'create-post__attach-btn',
      }),
  );

  public readonly submitButtonModel = computed(
    () =>
      new ButtonCommonModel({
        iconName: 'pi pi-send',
        label: 'Publicar',
        action: () => this.onSubmit(),
        permission: of({ allowed: true }),
        disabledSignal: this._submitDisabledSignal,
        styleClass: 'create-post__submit-btn',
      }),
  );

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

    this._publicationService
      .createPublication({
        title: this.form.value.title ?? '',
        description: this.form.value.description ?? '',
        imageUrl: this.imagePreview() ?? undefined,
      })
      .subscribe(() => {
        this.form.reset();
        this.imagePreview.set(null);
        this.publicationCreated.emit();
      });
  }
}
