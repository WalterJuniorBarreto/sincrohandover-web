import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ProjectService } from '../../services/project.service';
import { ProblemDetail } from '../../../../core/models/problem-detail.model';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>Crear Proyecto</h2>
      
      <!-- Ciberseguridad: Angular sanitiza automáticamente las salidas de Signals e Interpolación -->
      <div *ngIf="errorMessage()" class="alert alert-danger">
        {{ errorMessage() }}
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Nombre del Proyecto *</label>
          <input 
            id="name" 
            type="text" 
            formControlName="name" 
            placeholder="Ej. Migración AWS Fase 2"
            autocomplete="off">
            
          <!-- Mensajes de validación de Clean Code (Espejo del Backend) -->
          <div *ngIf="form.controls.name.touched && form.controls.name.errors" class="error-text">
            <small *ngIf="form.controls.name.errors['required']">El nombre es obligatorio.</small>
            <small *ngIf="form.controls.name.errors['maxlength']">El nombre no puede superar los 150 caracteres.</small>
          </div>
        </div>

        <button type="submit" [disabled]="form.invalid || isSubmitting()">
          {{ isSubmitting() ? 'Guardando...' : 'Crear Proyecto' }}
        </button>
      </form>
    </div>
  `
})
export class ProjectCreateComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly projectService = inject(ProjectService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const request = this.form.getRawValue();

    this.projectService.createProject(request).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: (response) => {
        console.log('Proyecto creado con éxito:', response.id);
        this.form.reset();
      },
      error: (err: ProblemDetail) => {
        this.errorMessage.set(err.detail || 'Error interno al crear el proyecto.');
      }
    });
  }
}