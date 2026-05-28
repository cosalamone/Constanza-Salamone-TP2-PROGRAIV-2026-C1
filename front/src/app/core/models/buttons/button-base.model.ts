import { Signal, signal, Type } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PermisoResponse } from '../permision-response';
import { ButtonBaseComponent } from '../../components/buttons/button-base/button-base.component';
import { ButtonStyle } from '../../utils/button-type';
import { ButtonSeverity } from 'primeng/button';
import { ButtonBaseInterface } from './button.interface';

export class ButtonModelBase implements ButtonBaseInterface {
  public type?: 'button' | 'submit' | 'reset';
  public style?: ButtonStyle;
  public severity?: ButtonSeverity;
  public iconName?: string;
  public tooltipMessage?: string;
  public optionDisabled?: boolean;
  public action: (value?: any) => void;
  public buttonType: Type<ButtonBaseComponent<any>>;
  public permission: Observable<PermisoResponse>;
  public label?: string;
  public iconPosition?: 'left' | 'right';
  public id?: string;
  public tooltipMessageDisabled?: string;
  public disabledSignal?: Signal<boolean>;
  public styleClass?: string;

  constructor(button: ButtonModelBase) {
    const initialDisabled = button.disabledSignal?.() ?? button.optionDisabled ?? false;

    this.action = button.action;
    this.type = button.type ?? 'button';
    this.style = button.style ?? 'filled';
    this.severity = button.severity ?? 'primary';
    this.buttonType = button.buttonType;
    this.tooltipMessage = button.tooltipMessage ?? '';
    this.optionDisabled = initialDisabled;
    this.iconName = button.iconName;
    this.label = button.label ?? '';
    this.permission = button.permission ?? of({ allowed: true });
    this.iconPosition = button.iconPosition ?? 'left';
    this.id = button.id;
    this.tooltipMessageDisabled = button.tooltipMessageDisabled ?? '';
    this.disabledSignal = button.disabledSignal ?? signal(initialDisabled);
    this.styleClass = button.styleClass;
  }
}
