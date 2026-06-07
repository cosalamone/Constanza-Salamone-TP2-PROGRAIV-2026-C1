import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, of, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { REGISTER_ERROR_CODES, REGISTER_MESSAGES } from './enums/register-messages.enum';
import { ButtonBaseComponent } from '../../../core/components/buttons/button-base/button-base.component';
import { FormErrorMessageComponent } from '../../../core/components/forms/form-error-message/form-error-message.component';
import { ToastService } from '../../../core/services/toast.service';
import { NavigateToService } from '../../../core/services/navigate/navigate-to.service';
import { nameValidator, passwordValidator, confirmPasswordValidator } from '../../../core/utils/form-validation';
import { RegisterButtonModel } from '../../../core/models/buttons/register-button.model';
import { IAuthError, IRegister } from '../../../core/interfaces/auth-interfaces/auth.interfaces';
import { AuthService } from '../../../services/auth/auth.service';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, ButtonBaseComponent, DatePickerModule, FormErrorMessageComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _toast = inject(ToastService);
  private readonly _navigateToService = inject(NavigateToService);

  public profileImageBase64 = signal<string>('');

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

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageBase64.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  public async onRegister(): Promise<void> {
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
      profileImage: this.profileImageBase64(),
      role: 'usuario',
    };

    const res = await this._authService.register(value);
    if (res.error as IAuthError | null) {
      const error: IAuthError = res.error as IAuthError;
      if (error?.code === REGISTER_ERROR_CODES.ALREADY_EXISTS) {
        this._toast.showError(REGISTER_MESSAGES.ALREADY_REGISTERED);
      } else if (error?.reasons?.some((reason) => reason === REGISTER_ERROR_CODES.CHARACTERS)) {
        this._toast.showError(REGISTER_MESSAGES.CHARACTERS_ERROR);
      } else {
        this._toast.showError(error?.message || 'Error al registrarse');
      }
    } else {
      this._toast.showSuccess(REGISTER_MESSAGES.SUCCESS);
      this._navigateToService.navigateToLogin();
    }
  }
}
