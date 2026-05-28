import { Component, computed, input } from '@angular/core';
import { CardBaseInterface } from '../../models/cards/card.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-card-base',

  templateUrl: './card-base.html',
  styleUrls: ['./card-base.css'],
  imports: [NgClass],
})
export class CardBaseComponent<T> {
  public readonly cardModel = input<CardBaseInterface<T>>();

  public readonly isDisabled = computed(
    () =>
      (this.cardModel()?.disabledSignal?.() ?? false) ||
      (this.cardModel()?.optionDisabled ?? false),
  );
}
