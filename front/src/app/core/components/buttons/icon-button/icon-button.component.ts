import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonBaseComponent } from '../button-base/button-base.component';
import { ButtonIconModel } from '../../../models/buttons/icons-buttons/button-icon.model';

@Component({
  selector: 'app-icon-button',
  imports: [ButtonModule, TooltipModule, AsyncPipe],
  templateUrl: './icon-button.component.html',
})
export class IconButtonComponent extends ButtonBaseComponent<ButtonIconModel> {}
