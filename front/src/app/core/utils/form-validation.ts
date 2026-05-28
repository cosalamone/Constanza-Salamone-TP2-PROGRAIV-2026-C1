import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const NAME_PATTERN = /^[A-Za-zÀ-ÿÑñ ]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]+$/; // Acepta letras, mayus mins y numeros - al menos 1 de cada uno

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
    return 'La contraseña debe tener al menos una letra y un número, y solo puede contener letras y números.';
  }

  return 'El valor ingresado no es válido.';
}
