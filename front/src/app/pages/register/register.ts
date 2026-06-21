import { Component, inject, signal, ViewChild } from '@angular/core';
import { REGISTER_ERROR_CODES, REGISTER_MESSAGES } from './enums/register-messages.enum';
import { ButtonBaseComponent } from '../../core/components/buttons/button-base/button-base.component';
import { PhotoCaptureService } from '../../core/services/photo-capture.service';
import { compressImage } from '../../core/utils/image-compression';
import { ToastService } from '../../core/services/toast.service';
import { NavigateToService } from '../../core/services/navigate/navigate-to.service';
import { IAuthError, IRegister } from '../../core/interfaces/auth-interfaces/auth.interfaces';
import { AuthService } from '../../services/auth/auth.service';
import { UserFormComponent } from '../../core/components/forms/user-form/user-form.component';
import { RegisterButtonModel } from '../../core/models/buttons/register-button.model';
import { map, of, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ButtonBaseComponent,
    UserFormComponent,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  private readonly _authService = inject(AuthService);
  private readonly _toast = inject(ToastService);
  private readonly _navigateToService = inject(NavigateToService);
  private readonly _photoCaptureService = inject(PhotoCaptureService);

  @ViewChild(UserFormComponent) userForm!: UserFormComponent;

  public readonly profileImage = signal<string | null>(null);

  public readonly registerDisabledSignal = signal(true);

  public registerButtonModel = signal(
    new RegisterButtonModel({
      action: () => this.userForm?.onSubmit(),
      disabledSignal: this.registerDisabledSignal,
      permission: of({ allowed: true }),
    }),
  );

  public async handlePhotoClick(): Promise<void> {
    const dataUrl = await this._photoCaptureService.capturePhoto();
    if (dataUrl) {
      const compressed = await compressImage(dataUrl);
      this.profileImage.set(compressed);
      this.userForm?.setPhoto(compressed);
    }
  }

  public onFormSubmitted(): void {
    if (!this.userForm) return;

    const formValue = this.userForm.form.value;
    const value: IRegister = {
      name: formValue.name ?? '',
      lastName: formValue.lastName ?? '',
      username: formValue.username ?? '',
      birthDate: new Date(formValue.birthDate ?? ''),
      password: formValue.password ?? '',
      description: formValue.description ?? '',
      role: 'usuario',
      profileImage: this.profileImage()!,
    };

    this._authService.register(value).subscribe({
      next: () => {
        this._toast.showSuccess(REGISTER_MESSAGES.SUCCESS);
        this._navigateToService.navigateToLogin();
      },
      error: (error) => {
        const errorResponse = error?.error;
        if (errorResponse?.code === REGISTER_ERROR_CODES.ALREADY_EXISTS) {
          this._toast.showError(REGISTER_MESSAGES.ALREADY_REGISTERED);
        } else if (
          errorResponse?.reasons?.some(
            (reason: string) => reason === REGISTER_ERROR_CODES.CHARACTERS,
          )
        ) {
          this._toast.showError(REGISTER_MESSAGES.CHARACTERS_ERROR);
        } else {
          this._toast.showError(errorResponse?.message || 'Error al registrarse');
        }
      },
    });
  }
}
