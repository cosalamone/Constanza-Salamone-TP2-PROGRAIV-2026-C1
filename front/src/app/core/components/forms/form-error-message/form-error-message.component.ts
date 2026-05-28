import { AbstractControl } from '@angular/forms';
import { Component, input } from '@angular/core';
import { getControlErrorMessage } from '../../../utils/form-validation';

@Component({
  selector: 'app-form-error-message',
  templateUrl: './form-error-message.component.html',
  styleUrls: ['./form-error-message.component.css'],
})
export class FormErrorMessageComponent {
  public readonly control = input<AbstractControl | null>(null);
  public readonly label = input.required<string>();

  public get errorMessage(): string | null {
    return getControlErrorMessage(this.control(), this.label());
  }
}
