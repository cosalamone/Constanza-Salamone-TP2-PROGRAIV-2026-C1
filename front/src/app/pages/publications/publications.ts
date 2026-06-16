import { Component, inject, signal, computed } from '@angular/core';
import { MockDataService } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth/auth.service';
import { IPublication } from '../../core/interfaces/publication.interface';
import { PublicationCardComponent } from '../../core/components/publication-card/publication-card';
import { CreatePostFormComponent } from '../../core/components/create-post-form/create-post-form';
import { Paginator } from 'primeng/paginator';
import { ButtonBaseComponent } from '../../core/components/buttons/button-base/button-base.component';
import { ButtonCommonModel } from '../../core/models/buttons/button-common.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [PublicationCardComponent, CreatePostFormComponent, Paginator, ButtonBaseComponent],
  templateUrl: './publications.html',
  styleUrls: ['./publications.css'],
})
export class Publications {
  private readonly _mockData = inject(MockDataService);
  private readonly _authService = inject(AuthService);

  public readonly sortMode = signal<'date' | 'likes'>('date');
  public readonly currentPage = signal<number>(0);
  public readonly publicationsPerPage = 10;

  public readonly publications = computed(() => {
    const result = this._mockData.getPublications(
      this.sortMode(),
      this.currentPage() + 1,
      this.publicationsPerPage,
    );
    return result.publications;
  });

  public readonly totalRecords = computed(() => {
    const result = this._mockData.getPublications(this.sortMode(), 1, this.publicationsPerPage);
    return result.total;
  });

  public readonly currentUserId = computed(() => this._authService.currentUser()?.id);

  public readonly sortDateButtonModel = computed(
    () =>
      new ButtonCommonModel({
        label: 'Recientes',
        action: () => this.onSortChange('date'),
        permission: of({ allowed: true }),
        styleClass:
          this.sortMode() === 'date'
            ? 'publications-page__sort-btn publications-page__sort-btn--active'
            : 'publications-page__sort-btn',
      }),
  );

  public readonly sortLikesButtonModel = computed(
    () =>
      new ButtonCommonModel({
        label: 'Más gustadas',
        action: () => this.onSortChange('likes'),
        permission: of({ allowed: true }),
        styleClass:
          this.sortMode() === 'likes'
            ? 'publications-page__sort-btn publications-page__sort-btn--active'
            : 'publications-page__sort-btn',
      }),
  );

  public onSortChange(mode: 'date' | 'likes'): void {
    this.sortMode.set(mode);
    this.currentPage.set(0);
  }

  public onPageChange(event: { page?: number; rows?: number; first?: number }): void {
    this.currentPage.set(event.page ?? 0);
  }

  public onLikeToggle(publicationId: string): void {
    this._mockData.toggleLike(publicationId);
    this.sortMode.update((v) => v);
  }

  public onDelete(publicationId: string): void {
    this._mockData.deletePublication(publicationId);
    this.sortMode.update((v) => v);
  }
}
