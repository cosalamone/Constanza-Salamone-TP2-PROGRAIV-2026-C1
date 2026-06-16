import { Injectable, inject } from '@angular/core';
import { IPublication } from '../core/interfaces/publication.interface';
import { AuthService, User } from './auth/auth.service';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private readonly _authService = inject(AuthService);

  private readonly _mockPublications: IPublication[] = [
    {
      id: '1',
      title: 'Atardecer en Palermo',
      description: 'Una tarde perfecta para caminar y disfrutar del cielo porteño.',
      user: { name: 'Lucas', lastName: 'Pérez', username: 'lucaslp' },
      likes: 24,
      comments: [
        { id: 'c1', text: '¡Qué hermoso! Yo también salí a caminar.', user: { name: 'Sofía', lastName: 'R.' }, createdAt: new Date('2026-06-16T10:00:00') },
        { id: 'c2', text: 'Me encanta ese barrio en esta época.', user: { name: 'Carlos', lastName: 'A.' }, createdAt: new Date('2026-06-16T10:30:00') },
      ],
      createdAt: new Date('2026-06-16T12:00:00'),
      isLikedByCurrentUser: false,
      userId: 'user1',
    },
    {
      id: '2',
      title: 'Tips para aprender Angular en 2025',
      description: 'Armé una lista de recursos que me hubiera gustado tener desde el principio.',
      user: { name: 'Sofía', lastName: 'Rodríguez', username: 'sofiar' },
      likes: 87,
      comments: [],
      createdAt: new Date('2026-06-16T08:00:00'),
      isLikedByCurrentUser: false,
      userId: 'user2',
    },
    {
      id: '3',
      title: 'Mi setup de trabajo 2025',
      description: 'Finalmente armé el espacio que siempre quise.',
      user: { name: 'María', lastName: 'González', username: 'mariag' },
      likes: 11,
      comments: [],
      createdAt: new Date('2026-06-14T15:00:00'),
      isLikedByCurrentUser: false,
      userId: 'user3',
    },
  ];

  public getPublications(sort: 'date' | 'likes' = 'date', page: number = 1, limit: number = 5): { publications: IPublication[]; total: number } {
    const sorted = [...this._mockPublications].sort((a, b) =>
      sort === 'likes' ? b.likes - a.likes : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const total = sorted.length;
    const start = (page - 1) * limit;
    return { publications: sorted.slice(start, start + limit), total };
  }

  public getPublicationsByUser(userId: string, limit: number = 3): IPublication[] {
    return this._mockPublications
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  public toggleLike(publicationId: string): void {
    const pub = this._mockPublications.find(p => p.id === publicationId);
    if (pub) {
      pub.isLikedByCurrentUser = !pub.isLikedByCurrentUser;
      pub.likes += pub.isLikedByCurrentUser ? 1 : -1;
    }
  }

  public deletePublication(publicationId: string): void {
    const idx = this._mockPublications.findIndex(p => p.id === publicationId);
    if (idx !== -1) this._mockPublications.splice(idx, 1);
  }

  public getCurrentUserProfile(): { user: User; stats: { publications: number; likes: number; comments: number } } | null {
    const user = this._authService.currentUser();
    if (!user) return null;

    const profileUser: User = {
      ...user,
      name: user.name || 'María',
      lastName: user.lastName || 'González',
      username: user.username || 'mariag',
      description: user.description || 'Diseñadora UX apasionada por proyectos con impacto social.',
    };

    const pubs = this._mockPublications.filter(p => p.userId === user.id);
    const stats = {
      publications: pubs.length,
      likes: pubs.reduce((sum, p) => sum + p.likes, 0),
      comments: pubs.reduce((sum, p) => sum + p.comments.length, 0),
    };

    return { user: profileUser, stats };
  }
}
