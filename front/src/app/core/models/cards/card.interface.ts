import { Signal } from '@angular/core';

export interface CardBaseInterface<T> {
  title?: string;
  description?: string;
  routerLink?: string;
  optionDisabled?: boolean;
  disabledSignal?: Signal<boolean>;
}
