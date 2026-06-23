import { Component, input, output, computed, signal } from '@angular/core';
import { IPublication } from '../../interfaces/publication.interface';
import { PhotoSlotComponent } from '../photo-slot/photo-slot.component';
import { ButtonBaseComponent } from '../buttons/button-base/button-base.component';
import { ButtonIconModel } from '../../models/buttons/icons-buttons/button-icon.model';
import { ButtonCommonModel } from '../../models/buttons/button-common.model';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { of } from 'rxjs';

@Component({
  selector: 'app-publication-card',
  standalone: true,
  imports: [PhotoSlotComponent, ButtonBaseComponent, TimeAgoPipe],
  templateUrl: './publication-card.html',
  styleUrls: ['./publication-card.css'],
})
export class PublicationCardComponent {
  public readonly publication = input.required<IPublication>();
  public readonly showComments = input<boolean>(false);
  public readonly canDelete = input<boolean>(false);
  public readonly likeLoading = input<boolean>(false);

  public readonly likeToggled = output<string>();
  public readonly deleteRequested = output<string>();
  public readonly commentClicked = output<string>();

  public readonly deleteButtonModel = computed(
    () =>
      new ButtonIconModel({
        iconName: 'pi pi-trash',
        style: 'outlined',
        action: () => this.onDelete(),
        permission: of({ allowed: true }),
        styleClass: 'pub-card__delete-btn',
        tooltipMessage: 'Eliminar publicación',
      }),
  );

  public readonly likeButtonModel = computed(
    () =>
      new ButtonCommonModel({
        iconName: this.publication().isLikedByCurrentUser ? 'pi pi-heart-fill' : 'pi pi-heart',
        label: `${this.publication().likes}`,
        action: () => this.onLike(),
        permission: of({ allowed: true }),
        style: 'outlined',
        styleClass: this.publication().isLikedByCurrentUser
          ? 'pub-card__action-btn liked'
          : 'pub-card__action-btn',
        disabledSignal: signal(this.likeLoading()),
      }),
  );

  public readonly commentButtonModel = computed(
    () =>
      new ButtonCommonModel({
        iconName: 'pi pi-comment',
        label: `${this.publication().comments.length}`,
        action: () => this.onComment(),
        style: 'outlined',
        permission: of({ allowed: true }),
        styleClass: 'pub-card__action-btn',
      }),
  );

  public onLike(): void {
    this.likeToggled.emit(this.publication().id);
  }

  public onDelete(): void {
    this.deleteRequested.emit(this.publication().id);
  }

  public onComment(): void {
    this.commentClicked.emit(this.publication().id);
  }
}
