import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigateToService {
  private _router = inject(Router);

  public navigateToLogin(): void {
    this._router.navigate(['/login']);
  }

  public navigateToHome(): void {
    this._router.navigate(['/home']);
  }

  public navigateToGames(): void {
    this._router.navigate(['/games']);
  }

  public navigateTo(path: string): void {
    this._router.navigate([path]);
  }
}
