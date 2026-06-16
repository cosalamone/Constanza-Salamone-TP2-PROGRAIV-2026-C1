import { Component, input, output, computed } from '@angular/core';
import { IPublication } from '../../interfaces/publication.interface';
import { PhotoSlotComponent } from '../photo-slot/photo-slot.component';

@Component({
  selector: 'app-publication-card',
  standalone: true,
  imports: [PhotoSlotComponent],
  templateUrl: './publication-card.html',
  styleUrls: ['./publication-card.css'],
})
export class PublicationCardComponent {
  public readonly publication = input.required<IPublication>();
  public readonly showComments = input<boolean>(false);
  public readonly canDelete = input<boolean>(false);

  public readonly likeToggled = output<string>();
  public readonly deleteRequested = output<string>();

  public readonly timeAgo = computed(() => {
    const pub = this.publication();
    const now = new Date();
    const created = new Date(pub.createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'ahora mismo';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return `hace ${Math.floor(diffDays / 7)} sem`;
  });

  public onLike(): void {
    this.likeToggled.emit(this.publication().id);
  }

  public onDelete(): void {
    this.deleteRequested.emit(this.publication().id);
  }
}
