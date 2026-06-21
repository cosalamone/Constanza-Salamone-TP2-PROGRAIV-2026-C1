import { Component, input, output, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorMessageComponent } from '../form-error-message/form-error-message.component';
import { PhotoSlotComponent } from '../../photo-slot/photo-slot.component';
import { DatePickerModule } from 'primeng/datepicker';
import {
  nameValidator,
  passwordValidator,
  confirmPasswordValidator,
} from '../../../utils/form-validation';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorMessageComponent, PhotoSlotComponent, DatePickerModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);

  public readonly showRole = input<boolean>(false);
  public readonly showConfirmPassword = input<boolean>(false);
  public readonly showPhoto = input<boolean>(false);
  public readonly showDescription = input<boolean>(true);
  public readonly roleDefault = input<string>('usuario');

  public readonly formSubmitted = output<void>();
  public readonly photoClick = output<void>();

  public readonly profileImage = signal<string | null>(null);

  public readonly form = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(2), nameValidator]],
    lastName: ['', [Validators.required, Validators.minLength(2), nameValidator]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    birthDate: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8), passwordValidator]],
    confirmPassword: [''],
    description: [''],
    role: ['usuario'],
  });

  ngOnInit(): void {
    this.form.get('role')?.setValue(this.roleDefault(), { emitEvent: false });

    if (this.showConfirmPassword()) {
      this.form.get('confirmPassword')?.setValidators([Validators.required, confirmPasswordValidator]);
      this.form.get('confirmPassword')?.updateValueAndValidity();
    }
  }

  public setPhoto(dataUrl: string): void {
    this.profileImage.set(dataUrl);
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmitted.emit();
  }
}
