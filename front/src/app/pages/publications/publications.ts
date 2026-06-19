import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { PublicationServices } from '../../services/publication/publication.services';
import { IPublication } from '../../core/interfaces/publication.interface';
import { PublicationCardComponent } from '../../core/components/publication-card/publication-card';
import { CreatePostFormComponent } from '../../core/components/create-post-form/create-post-form';
import { Paginator } from 'primeng/paginator';
import { ButtonBaseComponent } from '../../core/components/buttons/button-base/button-base.component';
import { ButtonCommonModel } from '../../core/models/buttons/button-common.model';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [
    PublicationCardComponent,
    CreatePostFormComponent,
    Paginator,
    ButtonBaseComponent,
    ConfirmDialog,
  ],
  providers: [ConfirmationService],
  templateUrl: './publications.html',
  styleUrls: ['./publications.css'],
})
export class Publications implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _publicationService = inject(PublicationServices);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _toastService = inject(ToastService);
  private readonly _router = inject(Router);

  public readonly sortMode = signal<'date' | 'likes'>('date');
  public readonly currentPage = signal<number>(0);
  public readonly publicationsPerPage = 10;

  public readonly publications = signal<IPublication[]>([]);
  public readonly totalRecords = signal<number>(0);

  public readonly currentUserId = computed(() => this._authService.currentUser()?.id);

  public readonly sortDateButtonModel = computed(
    () =>
      new ButtonCommonModel({
        label: 'Recientes',
        action: () => this.onSortChange('date'),
        permission: of({ allowed: true }),
        style: this.sortMode() === 'date' ? 'filled' : 'outlined',
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
        style: this.sortMode() === 'likes' ? 'filled' : 'outlined',
        styleClass:
          this.sortMode() === 'likes'
            ? 'publications-page__sort-btn publications-page__sort-btn--active'
            : 'publications-page__sort-btn',
      }),
  );

  ngOnInit(): void {
    this.loadPublications();
  }

  public onSortChange(mode: 'date' | 'likes'): void {
    if (this.sortMode() === mode) return;
    this.sortMode.set(mode);
    this.currentPage.set(0);
    this.loadPublications();
  }

  public onPageChange(event: { page?: number; rows?: number; first?: number }): void {
    this.currentPage.set(event.page ?? 0);
    this.loadPublications();
  }

  public onLikeToggle(publicationId: string): void {
    const userId = this._authService.currentUser()?.id;
    if (!userId) return;

    const publication = this.publications().find((p) => p.id === publicationId);
    if (!publication) return;

    const request$ = publication.isLikedByCurrentUser
      ? this._publicationService.removeLike(publicationId, userId)
      : this._publicationService.addLike(publicationId, userId);

    request$.subscribe({
      next: (updatedPub) => {
        this.publications.update((pubs) =>
          pubs.map((p) => (p.id === publicationId ? { ...p, ...updatedPub } : p)),
        );
      },
      error: (err) => {
        console.error('Error toggling like', err);
        this.loadPublications();
      },
    });
  }

  public onDelete(publicationId: string): void {
    this._confirmationService.confirm({
      message: '¿Estás seguro de que querés eliminar esta publicación?',
      header: 'Confirmar eliminación',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        const userId = this._authService.currentUser()?.id;
        if (!userId) return;

        this._publicationService.deletePublication(publicationId, userId).subscribe({
          next: () => {
            this._toastService.showSuccess('Publicación eliminada exitosamente');
            this.loadPublications();
          },
          error: (err) => console.error('Error deleting publication', err),
        });
      },
    });
  }

  public loadPublications(): void {
    this._publicationService
      .getPublications({
        page: this.currentPage() + 1,
        limit: this.publicationsPerPage,
        sort: this.sortMode(),
        currentUserId: this._authService.currentUser()?.id,
      })
      .subscribe({
        next: (response) => {
          this.publications.set(response.publications as IPublication[]);
          this.totalRecords.set(response.total);
        },
        error: (err) => console.error('Error loading publications', err),
      });
  }

  public onCommentClick(publicationId: string): void {
    this._router.navigate(['/publicaciones', publicationId]);
  }
}
