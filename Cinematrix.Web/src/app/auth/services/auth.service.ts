import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const API_URL = 'https://localhost:7243/api/usuarios/login';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<string | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private http = inject(HttpClient);

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);

 login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${API_URL}`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

    logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ token, user }: AuthResponse) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('token', token);

    return true;
  }

   private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
