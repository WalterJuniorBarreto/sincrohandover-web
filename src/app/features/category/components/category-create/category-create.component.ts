import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { CategoryService } from '../../services/category.service';
import { ProblemDetail } from '../../../../core/models/problem-detail.model';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- ... HTML idéntico al de proyecto, adaptado para Categoría ... -->
  `
})
export class CategoryCreateComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly categoryService = inject(CategoryService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Espejo de CategoryRequest.java
  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.categoryService.createCategory(this.form.getRawValue()).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: () => this.form.reset(),
      error: (err: ProblemDetail) => this.errorMessage.set(err.detail)
    });
  }
}