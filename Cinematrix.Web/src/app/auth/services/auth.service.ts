import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { rxResource } from '@angular/core/rxjs-interop';
type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const API_URL = '/api/usuarios';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<string | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });

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
      .post<AuthResponse>(`${API_URL}/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http
      .get<AuthResponse>(`${API_URL}/verificar`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
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
