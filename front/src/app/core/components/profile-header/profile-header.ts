import { Component, input } from '@angular/core';
import { User } from '../../../services/auth/auth.service';
import { PhotoSlotComponent } from '../photo-slot/photo-slot.component';
import { TruncateTextComponent } from '../truncate-text/truncate-text.component';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [PhotoSlotComponent, TruncateTextComponent],
  templateUrl: './profile-header.html',
  styleUrls: ['./profile-header.css'],
})
export class ProfileHeaderComponent {
  public readonly user = input.required<User>();
  public readonly stats = input.required<{
    publications: number;
    likes: number;
    comments: number;
  }>();
}
