import { Injectable, inject, signal } from '@angular/core';
import { IAuthError, ILogin, IRegister } from '../../core/interfaces/auth-interfaces/auth.interfaces';
import { UsersApiService } from '../users/users.api.service';

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _storageKey = 'tp2_current_user';
  private readonly _usersApiService = inject(UsersApiService);

  public currentUser = signal<User | null>(this._loadUser());

  constructor() {  }

  private _loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this._storageKey);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private _saveUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this._storageKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this._storageKey);
    }
  }

  public async register(data: IRegister): Promise<{ error: IAuthError | null }> {
    return this._usersApiService.create(data);
  }

  public async login(data: ILogin): Promise<{ error: IAuthError | null }> {
    const res = await this._usersApiService.login(data);
    if (res.error) {
      return { error: res.error };
    }

    if (res.user) {
      const user: User = {
        id: res.user._id || res.user.id,
        email: res.user.email,
        name: res.user.name,
        lastName: res.user.lastName,
        username: res.user.username,
        role: res.user.role,
      };
      this.currentUser.set(user);
      this._saveUser(user);
    }

    return { error: null };
  }

  public async logout(): Promise<void> {
    this.currentUser.set(null);
    this._saveUser(null);
  }

  public getCurrentUserName(): string {
    return this.currentUser()?.name ?? '';
  }

  public getCurrentUserLastName(): string {
    return this.currentUser()?.lastName ?? '';
  }

  public getCurrentUserFullName(): string {
    return [this.getCurrentUserName(), this.getCurrentUserLastName()]
      .filter((v): v is string => Boolean(v?.trim()))
      .join(' ')
      .trim();
  }
}
