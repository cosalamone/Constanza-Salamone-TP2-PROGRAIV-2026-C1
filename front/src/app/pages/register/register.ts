import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, of, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { REGISTER_ERROR_CODES, REGISTER_MESSAGES } from './enums/register-messages.enum';
import { ButtonBaseComponent } from '../../core/components/buttons/button-base/button-base.component';
import { FormErrorMessageComponent } from '../../core/components/forms/form-error-message/form-error-message.component';
import { PhotoSlotComponent } from '../../core/components/photo-slot/photo-slot.component';
import { PhotoCaptureService } from '../../core/services/photo-capture.service';
import { compressImage } from '../../core/utils/image-compression';
import { ToastService } from '../../core/services/toast.service';
import { NavigateToService } from '../../core/services/navigate/navigate-to.service';
import { nameValidator, passwordValidator, confirmPasswordValidator } from '../../core/utils/form-validation';
import { RegisterButtonModel } from '../../core/models/buttons/register-button.model';
import { IAuthError, IRegister } from '../../core/interfaces/auth-interfaces/auth.interfaces';
import { AuthService } from '../../services/auth/auth.service';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, ButtonBaseComponent, DatePickerModule, FormErrorMessageComponent, PhotoSlotComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _toast = inject(ToastService);
  private readonly _navigateToService = inject(NavigateToService);
  private readonly _photoCaptureService = inject(PhotoCaptureService);

  public readonly profileImage = signal<string | null>(null);

  public readonly registerFormGroup = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2), nameValidator]],
    lastName: ['', [Validators.required, Validators.minLength(2), nameValidator]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    birthDate: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8), passwordValidator]],
    confirmPassword: ['', [Validators.required, confirmPasswordValidator]],
    description: [''],
  });

  private readonly registerDisabledSignal = toSignal(
    this.registerFormGroup.statusChanges.pipe(
      startWith(this.registerFormGroup.status),
      map(() => this.registerFormGroup.invalid),
    ),
    { initialValue: this.registerFormGroup.invalid },
  );

  public registerButtonModel = signal(
    new RegisterButtonModel({
      action: () => this.onRegister(),
      disabledSignal: this.registerDisabledSignal,
      permission: of({ allowed: true }),
    }),
  );

   public async handlePhotoClick(): Promise<void> {
    const dataUrl = await this._photoCaptureService.capturePhoto();
    if (dataUrl) {
      const compressed = await compressImage(dataUrl);
      this.profileImage.set(compressed);
    }
   }

   public onRegister(): void {
    if (this.registerFormGroup.invalid) {
      this.registerFormGroup.markAllAsTouched();
      return;
    }

    const rawValue = this.registerFormGroup.getRawValue();
    const value: IRegister = {
      name: rawValue.name ?? '',
      lastName: rawValue.lastName ?? '',
      username: rawValue.username ?? '',
      birthDate: new Date(rawValue.birthDate ?? ''),
      password: rawValue.password ?? '',
      confirmPassword: rawValue.confirmPassword ?? '',
      description: rawValue.description ?? '',
      role: 'usuario',
      profileImage: this.profileImage() ?? undefined,
    };

    this._authService.register(value).subscribe({
      next: (res) => {
        console.log('res', res);
        this._toast.showSuccess(REGISTER_MESSAGES.SUCCESS);
        this._navigateToService.navigateToLogin();
      },
      error: (error) => {
        console.error('Error al registrarse:', error);
        const errorResponse = error?.error;
        if (errorResponse?.code === REGISTER_ERROR_CODES.ALREADY_EXISTS) {
          this._toast.showError(REGISTER_MESSAGES.ALREADY_REGISTERED);
        } else if (errorResponse?.reasons?.some((reason: string) => reason === REGISTER_ERROR_CODES.CHARACTERS)) {
          this._toast.showError(REGISTER_MESSAGES.CHARACTERS_ERROR);
        } else {
          this._toast.showError(errorResponse?.message || 'Error al registrarse');
        }
      },
    });
   }
}
