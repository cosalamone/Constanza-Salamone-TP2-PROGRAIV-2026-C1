import { Component, inject, computed } from '@angular/core';
import { MockDataService } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProfileHeaderComponent } from '../../core/components/profile-header/profile-header';
import { PublicationCardComponent } from '../../core/components/publication-card/publication-card';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [ProfileHeaderComponent, PublicationCardComponent],
  templateUrl: './my-profile.html',
  styleUrls: ['./my-profile.css'],
})
export class MyProfile {
  private readonly _mockData = inject(MockDataService);
  private readonly _authService = inject(AuthService);

  public readonly profileData = computed(() => this._mockData.getCurrentUserProfile());
  public readonly publications = computed(() => {
    const userId = this._authService.currentUser()?.id;
    if (!userId) return [];
    return this._mockData.getPublicationsByUser(userId, 3);
  });

  public readonly currentUserId = computed(() => this._authService.currentUser()?.id);
}
