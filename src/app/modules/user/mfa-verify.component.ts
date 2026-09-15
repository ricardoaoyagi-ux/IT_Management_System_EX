import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from './user.service';

@Component({
  selector: 'app-mfa-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  template: `
    <div style="max-width:400px;margin:auto;padding:1rem;">
      <h2>Verificação MFA</h2>
      <form [formGroup]="form" (ngSubmit)="verifyCode()">
        <mat-form-field appearance="fill" style="width:100%;">
          <mat-label>Código MFA</mat-label>
          <input matInput formControlName="code" />
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Verificar
        </button>
      </form>
      <p *ngIf="error" style="color:red;">Código inválido!</p>
    </div>
  `
})
export class MfaVerifyComponent {
  form: FormGroup;
  error = false;

  constructor(private fb: FormBuilder,private userService: UserService,  private router: Router) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

verifyCode() {
  const user = JSON.parse(localStorage.getItem('user')!);
  const code = this.form.value.code;

  this.userService.validateTOTP(code, user.userId)
    .subscribe({
      next: () => {
        user.mfaVerified = true;
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/app/dashboard']);
      },
      error: () => {
        this.error = true;
      }
    });
}
}