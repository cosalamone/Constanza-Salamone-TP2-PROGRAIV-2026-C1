import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardBaseInterface } from '../../../models/cards/card.interface';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-navigation-card',
  imports: [RouterLink, NgClass, TooltipModule],
  templateUrl: './navigation-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationCardComponent {
  private readonly _authService = inject(AuthService);

  public readonly cardModel = input<CardBaseInterface<unknown>>();

  public readonly isDisabled = computed(
    () =>
      (this.cardModel()?.disabledSignal?.() ?? false) ||
      (this.cardModel()?.optionDisabled ?? false),
  );

  public readonly showTooltip = computed(() => false);
}
