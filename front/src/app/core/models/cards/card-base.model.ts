import { Signal, signal } from '@angular/core';
import { CardBaseInterface } from './card.interface';

export class CardModelBase<T = any> implements CardBaseInterface<T> {
  public title?: string;
  public description?: string;
  public routerLink?: string;
  public optionDisabled?: boolean;
  public disabledSignal?: Signal<boolean>;

  constructor(card: CardBaseInterface<T>) {
    const initialDisabled = (card.disabledSignal?.() ?? false) || (card.optionDisabled ?? false);

    this.title = card.title;
    this.description = card.description;
    this.routerLink = card.routerLink;
    this.optionDisabled = card.optionDisabled ?? false;
    this.disabledSignal = card.disabledSignal ?? signal(initialDisabled);
  }
}
