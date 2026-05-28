import { NgComponentOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { ButtonBaseInterface } from '../../../models/buttons/button.interface';

@Component({
  selector: 'app-button',
  templateUrl: './button-base.component.html',
  imports: [NgComponentOutlet],
})
export class ButtonBaseComponent<T extends ButtonBaseInterface> {
  public readonly tableName = input<string>();

  targetId = input<any>();
  buttonModel = input<T>();
}
