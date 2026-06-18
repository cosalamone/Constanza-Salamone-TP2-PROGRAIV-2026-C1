import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { PublicationServices } from '../../services/publication/publication.services';
import { CommentService } from '../../services/comment/comment.service';
import { IPublication, IComment } from '../../core/interfaces/publication.interface';
import { PublicationCardComponent } from '../../core/components/publication-card/publication-card';
import { PhotoSlotComponent } from '../../core/components/photo-slot/photo-slot.component';
import { ButtonBaseComponent } from '../../core/components/buttons/button-base/button-base.component';
import { ButtonCommonModel } from '../../core/models/buttons/button-common.model';
import { ButtonIconModel } from '../../core/models/buttons/icons-buttons/button-icon.model';
import { ToastService } from '../../core/services/toast.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-publication-detail',
  standalone: true,
  imports: [FormsModule, PublicationCardComponent, PhotoSlotComponent, ButtonBaseComponent],
  templateUrl: './publication-detail.html',
  styleUrls: ['./publication-detail.css'],
})
export class PublicationDetail implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _publicationService = inject(PublicationServices);
  private readonly _commentService = inject(CommentService);
  private readonly _toastService = inject(ToastService);

  public readonly publication = signal<IPublication | null>(null);
  public readonly comments = signal<IComment[]>([]);
  public readonly loading = signal<boolean>(true);
  public readonly commentText = signal<string>('');
  public readonly editingCommentId = signal<string | null>(null);
  public readonly editingCommentText = signal<string>('');
  public readonly currentCommentPage = signal<number>(1);
  public readonly totalCommentPages = signal<number>(1);
  public readonly commentsLoading = signal<boolean>(false);

  public readonly currentUserId = computed(() => this._authService.currentUser()?.id);

  public readonly backButtonModel = computed(
    () =>
      new ButtonIconModel({
        iconName: 'pi pi-arrow-left',
        label: 'Volver',
        action: () => this.goBack(),
        permission: of({ allowed: true }),
        style: 'outlined',
        styleClass: 'pub-detail__back-btn',
      }),
  );

  public readonly sendButtonModel = computed(
    () =>
      new ButtonCommonModel({
        iconName: 'pi pi-send',
        label: '',
        action: () => this.onAddComment(),
        permission: of({ allowed: true }),
        style: 'filled',
        styleClass: 'pub-detail__send-btn',
      }),
  );

  public readonly editSaveButtonModel = computed(
    () =>
      new ButtonIconModel({
        iconName: 'pi pi-check',
        action: () => this.onSaveEdit(this.editingCommentId() ?? ''),
        permission: of({ allowed: true }),
        style: 'icon-outlined',
        styleClass: 'pub-detail__edit-save-btn',
      }),
  );

  public readonly editCancelButtonModel = computed(
    () =>
      new ButtonIconModel({
        iconName: 'pi pi-times',
        action: () => this.onCancelEdit(),
        permission: of({ allowed: true }),
        style: 'icon-outlined',
        styleClass: 'pub-detail__edit-cancel-btn',
      }),
  );

  public getEditCommentButtonModel(comment: IComment): ButtonIconModel {
    return new ButtonIconModel({
      iconName: 'pi pi-pencil',
      action: () => this.onStartEdit(comment),
      permission: of({ allowed: true }),
      style: 'icon-outlined',
      styleClass: 'pub-detail__comment-edit-btn',
    });
  }

  public readonly loadMoreButtonModel = computed(
    () =>
      new ButtonCommonModel({
        iconName: this.commentsLoading() ? 'pi pi-spin pi-spinner' : '',
        label: this.commentsLoading() ? 'Cargando...' : 'Cargar más comentarios',
        action: () => this.onLoadMoreComments(),
        permission: of({ allowed: true }),
        style: 'outlined',
        disabledSignal: this.commentsLoading,
        styleClass: 'pub-detail__load-more-btn',
      }),
  );

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPublication(id);
      this.loadComments(id, 1);
    }
  }

  public goBack(): void {
    this._router.navigate(['/publicaciones']);
  }

  public loadPublication(id: string): void {
    this.loading.set(true);
    this._publicationService
      .getPublications({
        page: 1,
        limit: 1,
        sort: 'date',
        currentUserId: this._authService.currentUser()?.id,
      })
      .subscribe({
        next: (response) => {
          const pub = response.publications.find((p: any) => p.id === id);
          if (pub) {
            this.publication.set(pub as IPublication);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  public loadComments(publicationId: string, page: number): void {
    this.commentsLoading.set(true);
    this._commentService.getComments(publicationId, page, 3).subscribe({
      next: (response) => {
        if (page === 1) {
          this.comments.set(response.comments as IComment[]);
        } else {
          this.comments.update((prev) => [...prev, ...(response.comments as IComment[])]);
        }
        this.totalCommentPages.set(response.totalPages);
        this.currentCommentPage.set(page);
        this.commentsLoading.set(false);
      },
      error: () => this.commentsLoading.set(false),
    });
  }

  public onLoadMoreComments(): void {
    const pub = this.publication();
    if (!pub) return;
    this.loadComments(pub.id, this.currentCommentPage() + 1);
  }

  public onLikeToggle(): void {
    const pub = this.publication();
    const userId = this._authService.currentUser()?.id;
    if (!pub || !userId) return;

    const request$ = pub.isLikedByCurrentUser
      ? this._publicationService.removeLike(pub.id, userId)
      : this._publicationService.addLike(pub.id, userId);

    request$.subscribe({
      next: (updatedPub: any) => {
        this.publication.update((p) => (p ? { ...p, ...updatedPub } : p));
      },
      error: () => this.loadPublication(pub.id),
    });
  }

  public onDelete(): void {
    const pub = this.publication();
    const userId = this._authService.currentUser()?.id;
    if (!pub || !userId) return;

    this._publicationService.deletePublication(pub.id, userId).subscribe({
      next: () => {
        this._toastService.showSuccess('Publicación eliminada');
        this.goBack();
      },
      error: () => this._toastService.showError('Error al eliminar'),
    });
  }

  public onAddComment(): void {
    const pub = this.publication();
    const userId = this._authService.currentUser()?.id;
    const text = this.commentText().trim();
    if (!pub || !userId || !text) return;

    this._commentService.addComment(pub.id, { text, userId }).subscribe({
      next: (newComment) => {
        this.comments.update((prev) => [newComment as IComment, ...prev]);
        this.commentText.set('');
        this.publication.update((p) =>
          p ? { ...p, comments: [...p.comments, newComment as IComment] } : p,
        );
        this._toastService.showSuccess('Comentario agregado');
      },
      error: () => this._toastService.showError('Error al agregar comentario'),
    });
  }

  public onStartEdit(comment: IComment): void {
    this.editingCommentId.set(comment.id);
    this.editingCommentText.set(comment.text);
  }

  public onCancelEdit(): void {
    this.editingCommentId.set(null);
    this.editingCommentText.set('');
  }

  public onSaveEdit(commentId: string): void {
    const pub = this.publication();
    const userId = this._authService.currentUser()?.id;
    const text = this.editingCommentText().trim();
    if (!pub || !userId || !text) return;

    this._commentService.editComment(pub.id, commentId, { text, userId }).subscribe({
      next: (updatedComment) => {
        this.comments.update((prev) =>
          prev.map((c) => (c.id === commentId ? (updatedComment as IComment) : c)),
        );
        this.editingCommentId.set(null);
        this.editingCommentText.set('');
        this._toastService.showSuccess('Comentario editado');
      },
      error: () => this._toastService.showError('Error al editar comentario'),
    });
  }

  public canEditComment(comment: IComment): boolean {
    return comment.user.username === this._authService.currentUser()?.username;
  }

  public commentTimeAgo(date: Date): string {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'ahora mismo';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays < 7) return `hace ${diffDays}d`;
    return `hace ${Math.floor(diffDays / 7)}sem`;
  }
}
