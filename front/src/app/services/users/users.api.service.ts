import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IAuthError, IRegister } from '../../core/interfaces/auth-interfaces/auth.interfaces';

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly _http = inject(HttpClient);

  async create(data: IRegister): Promise<{ error: IAuthError | null }> {
    await firstValueFrom(this._http.post(`${API_URL}/users`, data));
    return { error: null };
  }
}
