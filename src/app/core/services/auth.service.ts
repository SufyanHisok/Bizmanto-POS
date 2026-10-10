import { Injectable, computed, signal } from '@angular/core';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
}

const STORAGE_KEY = 'bm_pos_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSignal = signal<AuthUser | null>(this.readStored());

  readonly user = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.userSignal());

  login(email: string, _password: string): { ok: true } | { ok: false; message: string } {
    const trimmed = email.trim();
    if (!trimmed) {
      return { ok: false, message: 'Enter email or mobile number.' };
    }
    if (_password.trim().length < 3) {
      return { ok: false, message: 'Password must be at least 3 characters.' };
    }

    const user: AuthUser = {
      id: 'u1',
      name: trimmed.includes('@') ? trimmed.split('@')[0] : trimmed,
      email: trimmed.includes('@') ? trimmed : `${trimmed}@bizmanto.local`,
      role: 'Cashier',
      branch: 'Main Branch — Karachi',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.userSignal.set(user);
    return { ok: true };
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.userSignal.set(null);
  }

  private readStored(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
