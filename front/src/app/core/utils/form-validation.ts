import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const NAME_PATTERN = /^[A-Za-zÀ-ÿÑñ ]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d)[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/; // Al menos 1 mayúscula, 1 número, mín 8 chars validado por minLength

export const nameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) {
    return null;
  }

  return NAME_PATTERN.test(control.value) ? null : { namePattern: true };
};

export const passwordValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!control.value) {
    return null;
  }

  return PASSWORD_PATTERN.test(control.value) ? null : { passwordPattern: true };
};

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!control.value) {
    return null;
  }

  const password = control.parent?.get('password');
  if (!password) {
    return null;
  }

  return control.value === password.value ? null : { confirmPasswordMismatch: true };
};

export function getControlErrorMessage(
  control: AbstractControl | null,
  fieldLabel: string,
): string | null {
  if (!control || !control.errors || !(control.touched || control.dirty)) {
    return null;
  }

  if (control.errors['required']) {
    return `${fieldLabel} es obligatorio.`;
  }

  if (control.errors['email']) {
    return 'Ingresá un correo electrónico válido.';
  }

  if (control.errors['minlength']) {
    const requiredLength = control.errors['minlength'].requiredLength;
    return `${fieldLabel} debe tener al menos ${requiredLength} caracteres.`;
  }

  if (control.errors['namePattern']) {
    return `${fieldLabel} solo puede contener letras y espacios.`;
  }

  if (control.errors['passwordPattern']) {
    return 'La contraseña debe tener al menos una mayúscula y un número.';
  }

  if (control.errors['confirmPasswordMismatch']) {
    return 'Las contraseñas no coinciden.';
  }

  return 'El valor ingresado no es válido.';
}
