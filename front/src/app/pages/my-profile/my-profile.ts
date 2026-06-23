import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { PublicationServices } from '../../services/publication/publication.services';
import { ProfileHeaderComponent } from '../../core/components/profile-header/profile-header';
import { PublicationCardComponent } from '../../core/components/publication-card/publication-card';
import { IPublication } from '../../core/interfaces/publication.interface';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [ProfileHeaderComponent, PublicationCardComponent, ConfirmDialog],
  templateUrl: './my-profile.html',
  styleUrls: ['./my-profile.css'],
})
export class MyProfile implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _publicationService = inject(PublicationServices);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _toastService = inject(ToastService);
  private readonly _router = inject(Router);

  private readonly _publications = signal<IPublication[]>([]);

  public readonly profileData = computed(() => {
    const user = this._authService.currentUser();
    if (!user) return null;

    const pubs = this._publications();
    const stats = {
      publications: pubs.length,
      likes: pubs.reduce((sum, p) => sum + p.likes, 0),
      comments: pubs.reduce((sum, p) => sum + p.comments.length, 0),
    };

    return { user, stats };
  });

  public readonly publications = computed(() => this._publications().slice(0, 3));

  public readonly currentUserId = computed(() => this._authService.currentUser()?.id);
  public readonly isAdmin = computed(() => this._authService.currentUser()?.role === 'admin');

  public ngOnInit(): void {
    this._loadUserPublications();
  }

  private _loadUserPublications(): void {
    const userId = this._authService.currentUser()?.id;
    if (!userId) return;

    this._publicationService
      .getPublications({ page: 1, limit: 3, sort: 'date', userId })
      .subscribe({
        next: (response) => {
          this._publications.set(response.publications as IPublication[]);
        },
        error: (err) => console.error('Error loading publications', err),
      });
  }

  public onLikeToggle(publicationId: string): void {
    const publication = this._publications().find((p) => p.id === publicationId);
    if (!publication) return;

    const previousLikes = publication.likes;
    const previousIsLiked = publication.isLikedByCurrentUser;

    this._publications.update((pubs) =>
      pubs.map((p) =>
        p.id === publicationId
          ? {
              ...p,
              likes: p.isLikedByCurrentUser ? p.likes - 1 : p.likes + 1,
              isLikedByCurrentUser: !p.isLikedByCurrentUser,
            }
          : p,
      ),
    );

    const request$ = previousIsLiked
      ? this._publicationService.removeLike(publicationId)
      : this._publicationService.addLike(publicationId);

    request$.subscribe({
      next: (updatedPub) => {
        this._publications.update((pubs) =>
          pubs.map((p) => (p.id === publicationId ? { ...p, ...updatedPub } : p)),
        );
      },
      error: () => {
        this._publications.update((pubs) =>
          pubs.map((p) =>
            p.id === publicationId
              ? { ...p, likes: previousLikes, isLikedByCurrentUser: previousIsLiked }
              : p,
          ),
        );
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
        this._publicationService.deletePublication(publicationId).subscribe({
          next: () => {
            this._confirmationService.close();
            this._toastService.showSuccess('Publicación eliminada exitosamente');
            this._loadUserPublications();
          },
          error: (err) => {
            this._confirmationService.close();
            console.error('Error deleting publication', err);
          },
        });
      },
    });
  }

  public onCommentClick(publicationId: string): void {
    this._router.navigate(['/publicaciones', publicationId]);
  }
}
