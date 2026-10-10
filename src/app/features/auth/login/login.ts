import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BmButton } from '../../../shared/ui/bm-button/bm-button';

@Component({
  selector: 'app-login',
  imports: [FormsModule, BmButton],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  remember = true;
  readonly error = signal('');
  readonly loading = signal(false);

  submit(): void {
    this.error.set('');
    this.loading.set(true);

    const result = this.auth.login(this.email, this.password);
    this.loading.set(false);

    if (!result.ok) {
      this.error.set(result.message);
      return;
    }

    void this.router.navigateByUrl('/dashboard');
  }
}
