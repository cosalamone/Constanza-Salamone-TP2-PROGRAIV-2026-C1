import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.html',
})
export class Home {
  private readonly _authService = inject(AuthService);

  public get userName(): string {
    return this._authService.getCurrentUserFullName();
  }

  public get isLoggedIn(): boolean {
    return this._authService.currentUser() !== null;
  }
}
