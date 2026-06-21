import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../api/api-base.service';
import { IUser, ICreateUserRequest } from './user.interface';

export type { IUser, ICreateUserRequest } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiBaseService {
  constructor() {
    super();
  }

  getUsers(): Observable<IUser[]> {
    return this._httpClient.get<IUser[]>(`${this._apiUrl}/users`);
  }

  createUser(userData: ICreateUserRequest): Observable<IUser> {
    return this._httpClient.post<IUser>(`${this._apiUrl}/users`, userData);
  }

  disableUser(id: string): Observable<IUser> {
    return this._httpClient.delete<IUser>(`${this._apiUrl}/users/${id}`);
  }

  enableUser(id: string): Observable<IUser> {
    return this._httpClient.post<IUser>(`${this._apiUrl}/users/${id}/enable`, {});
  }
}
