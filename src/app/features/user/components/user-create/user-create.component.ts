import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { ProblemDetail } from '../../../../core/models/problem-detail.model';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- ... HTML del formulario con inputs para email, timezone, workStart, workEnd ... -->
  `
})
export class UserCreateComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly userService = inject(UserService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Espejo de AppUserRequest.java
  readonly form = this.fb.group({
    // Ciberseguridad: Validar el formato de email en cliente evita llamadas HTTP basura
    email: ['', [Validators.required, Validators.email]],
    // Validaciones de negocio requeridas por el backend
    timezone: ['America/Lima', [Validators.required]],
    workStart: ['09:00', [Validators.required]],
    workEnd: ['18:00', [Validators.required]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    // TypeScript formatea el objeto exactamente como espera nuestro Backend
    this.userService.createUser(this.form.getRawValue()).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: (response) => {
        console.log('Usuario configurado:', response.email);
        this.form.reset({ timezone: 'America/Lima', workStart: '09:00', workEnd: '18:00' });
      },
      error: (err: ProblemDetail) => {
        this.errorMessage.set(err.detail);
      }
    });
  }
}