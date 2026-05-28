import { Injectable, signal } from '@angular/core';
import { IAuthError, ILogin, IRegister } from '../../core/interfaces/auth-interfaces/auth.interfaces';

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _storageKey = 'tp2_current_user';

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
    // Mock: simula éxito y guarda el usuario para poder loguearse después
    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      lastName: data.lastName,
    };

    // Guardar en "base de datos mock" (localStorage con prefijo)
    const mockDbKey = `tp2_mock_user_${data.email}`;
    localStorage.setItem(mockDbKey, JSON.stringify({ ...user, password: data.password }));

    return { error: null };
  }

  public async login(data: ILogin): Promise<{ error: IAuthError | null }> {
    // Mock: permite login con quick-login users o usuarios registrados previamente
    const quickUsers: Record<string, string> = {
      'usuario1@mail.com': 'hola123',
      'usuario2@mail.com': 'hola123',
      'usuario3@mail.com': 'hola123',
    };

    // Verificar quick users
    if (quickUsers[data.email] && quickUsers[data.email] === data.password) {
      const user: User = {
        id: crypto.randomUUID(),
        email: data.email,
        name: data.email.split('@')[0],
        lastName: 'Usuario',
      };
      this.currentUser.set(user);
      this._saveUser(user);
      return { error: null };
    }

    // Verificar usuarios registrados en mock DB
    const mockDbKey = `tp2_mock_user_${data.email}`;
    const raw = localStorage.getItem(mockDbKey);
    if (raw) {
      const stored = JSON.parse(raw);
      if (stored.password === data.password) {
        const user: User = {
          id: stored.id,
          email: stored.email,
          name: stored.name,
          lastName: stored.lastName,
        };
        this.currentUser.set(user);
        this._saveUser(user);
        return { error: null };
      }
    }

    return {
      error: {
        message: 'Credenciales inválidas',
        code: 'invalid_credentials',
        status: 401,
        reasons: [],
      },
    };
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
