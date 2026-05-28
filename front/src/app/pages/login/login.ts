import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginButtonModel } from '../../core/models/buttons/login-button.model';
import { map, of, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LOGIN_ERROR_CODES, LOGIN_MESSAGES } from './enums/login-messsages.enum';
import { FormErrorMessageComponent } from '../../core/components/forms/form-error-message/form-error-message.component';
import { passwordValidator } from '../../core/utils/form-validation';
import { QuickLoginComponent } from './components/quick-login/quick-login.component';
import { ButtonBaseComponent } from '../../core/components/buttons/button-base/button-base.component';
import { NavigateToService } from '../../core/services/navigate/navigate-to.service';
import { IAuthError, ILogin } from '../../core/interfaces/auth-interfaces/auth.interfaces';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    ButtonBaseComponent,
    FormErrorMessageComponent,
    QuickLoginComponent,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _navigateToService = inject(NavigateToService);
  private readonly _toast = inject(ToastService);

  public readonly loginFormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), passwordValidator]],
  });

  private readonly loginDisabledSignal = toSignal(
    this.loginFormGroup.statusChanges.pipe(
      startWith(this.loginFormGroup.status),
      map(() => this.loginFormGroup.invalid),
    ),
    { initialValue: this.loginFormGroup.invalid },
  );

  public loginButtonModel = signal(
    new LoginButtonModel({
      action: () => this.onLogin(),
      disabledSignal: this.loginDisabledSignal,
      permission: of({ allowed: true }),
    }),
  );

  public async onLogin(): Promise<void> {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }

    const rawValue = this.loginFormGroup.getRawValue();
    await this.generateLogin({
      email: rawValue.email ?? '',
      password: rawValue.password ?? '',
    });
  }

  public async onQuickLogin(credentials: ILogin): Promise<void> {
    await this.generateLogin(credentials);
  }

  private async generateLogin(value: ILogin): Promise<void> {
    const res = await this._authService.login(value);
    if (res.error as IAuthError | null) {
      const error: IAuthError = res.error as IAuthError; // HECHO PARA QUE TOME EL TIPADO, SINO NO ERA POSIBLE DIFERENCIAR LOS ERRORES -  //TODO: ver si es mejroable!
      if (error?.code === LOGIN_ERROR_CODES.INVALID_CREDENTIALS) {
        this._toast.showError(LOGIN_MESSAGES.INVALID_CREDENTIALS);
      }
    } else {
      this._toast.showSuccess(LOGIN_MESSAGES.SUCCESS);
      this._navigateToService.navigateToHome();
    }
  }
}
