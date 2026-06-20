import { Injectable, inject, signal } from '@angular/core';
import { ILogin, IRegister } from '../../core/interfaces/auth-interfaces/auth.interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiBaseService } from '../api/api-base.service';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  name: string;
  lastName: string;
  username: string;
  role: string;
  profileImage?: string;
  description?: string;
  birthDate?: Date;
}

interface AuthResponse {
  user: any;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiBaseService {
  private readonly _storageKey = 'tp2_current_user';
  private readonly _tokenKey = 'tp2_access_token';

  public readonly currentUser = signal<User | null>(this._getStoredUser());

  constructor() {
    super();
  }

  private _getStoredUser(): User | null {
    const stored = localStorage.getItem(this._storageKey);
    if (stored) {
      try {
        return JSON.parse(stored) as User;
      } catch {
        return null;
      }
    }
    return null;
  }

  public getToken(): string | null {
    return localStorage.getItem(this._tokenKey);
  }

  public register(registerData: IRegister): Observable<AuthResponse> {
    return this._httpClient.post<AuthResponse>(`${this._apiUrl}/auth/register`, registerData).pipe(
      tap((res) => {
        this._saveSession(res);
      }),
    );
  }

  public login(loginData: ILogin): Observable<AuthResponse> {
    return this._httpClient.post<AuthResponse>(`${this._apiUrl}/auth/login`, loginData).pipe(
      tap((res) => {
        this._saveSession(res);
      }),
    );
  }

  private _saveSession(res: AuthResponse): void {
    const user: User = { ...res.user, id: res.user._id };
    localStorage.setItem(this._storageKey, JSON.stringify(user));
    localStorage.setItem(this._tokenKey, res.access_token);
    this.currentUser.set(user);
  }

  public logout(): void {
    localStorage.removeItem(this._storageKey);
    localStorage.removeItem(this._tokenKey);
    this.currentUser.set(null);
  }
}
