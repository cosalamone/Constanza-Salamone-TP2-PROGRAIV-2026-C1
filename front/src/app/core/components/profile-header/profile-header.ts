import { Component, input, computed } from '@angular/core';
import { User } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  templateUrl: './profile-header.html',
  styleUrls: ['./profile-header.css'],
})
export class ProfileHeaderComponent {
  public readonly user = input.required<User>();
  public readonly stats = input.required<{ publications: number; likes: number; comments: number }>();

  public readonly userInitials = computed(() => {
    const u = this.user();
    const first = u.name?.charAt(0) || '';
    const last = u.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  });
}
