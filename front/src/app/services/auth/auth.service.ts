import { Injectable, inject, signal } from '@angular/core';
import { ILogin, IRegister } from '../../core/interfaces/auth-interfaces/auth.interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiBaseService } from '../api/api-base.service';
import { firstValueFrom } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiBaseService {
  private readonly _storageKey = 'tp2_current_user';

  public readonly currentUser = signal<User | null>(this._getStoredUser());

  constructor() {
    super()
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


   public async register(registerData: IRegister): Promise<Object> {
    return firstValueFrom(this._httpClient.post(`${this._apiUrl}/auth/register`, registerData));
  }


  public async login(loginData: ILogin): Promise<User> {
    const user = await firstValueFrom(this._httpClient.post<User>(`${this._apiUrl}/auth/login`, loginData));
    localStorage.setItem(this._storageKey, JSON.stringify(user));
    this.currentUser.set(user);
    return user;
  }

  public logout(): void {
    localStorage.removeItem(this._storageKey);
    this.currentUser.set(null);
  }

}
