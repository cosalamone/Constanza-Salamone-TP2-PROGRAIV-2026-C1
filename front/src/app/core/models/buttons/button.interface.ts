import { Observable } from 'rxjs';

import { Signal, Type } from '@angular/core';
import { ButtonStyle } from '../../utils/button-type';
import { ButtonBaseComponent } from '../../components/buttons/button-base/button-base.component';
import { PermisoResponse } from '../permision-response';
import { ButtonSeverity } from 'primeng/button';

export interface ButtonBaseInterface {
  type?: 'button' | 'submit' | 'reset';
  style?: ButtonStyle;
  severity?: ButtonSeverity;
  tooltipMessage?: string;
  permission: Observable<PermisoResponse>;
  optionDisabled?: boolean;
  iconName?: string;
  label?: string;
  buttonType: Type<ButtonBaseComponent<any>>;
  action: (value?: any) => void;
  iconPosition?: 'left' | 'right';
  disabledSignal?: Signal<boolean>;
  id?: string;
}

export interface LinkableInterface {
  routerLink: string;
}

export interface SearchInterface {
  searchField: string;
  valueShowOpenSearch?: string;
  action: (value?: any) => void;
}

export interface RedirectableInterface {
  setResultRedirected: (value: any) => void;
}
