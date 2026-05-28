import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonBaseComponent } from '../button-base/button-base.component';
import { ButtonCommonModel } from '../../../models/buttons/button-common.model';

@Component({
  selector: 'app-common-button',
  imports: [ButtonModule, TooltipModule, AsyncPipe],
  templateUrl: './common-button.component.html',
})
export class ButtonCommonComponent extends ButtonBaseComponent<ButtonCommonModel> {}
