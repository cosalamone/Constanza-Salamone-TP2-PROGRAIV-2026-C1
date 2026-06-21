import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { PublicationServices } from '../../services/publication/publication.services';
import { ProfileHeaderComponent } from '../../core/components/profile-header/profile-header';
import { PublicationCardComponent } from '../../core/components/publication-card/publication-card';
import { IPublication } from '../../core/interfaces/publication.interface';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [ProfileHeaderComponent, PublicationCardComponent],
  templateUrl: './my-profile.html',
  styleUrls: ['./my-profile.css'],
})
export class MyProfile implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _publicationService = inject(PublicationServices);

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
}
