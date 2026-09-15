import { Component } from '@angular/core';
import { FormBuilder, Validators,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../user/auth.service';


@Component({
  standalone: true,
  selector: 'app-change-password-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
  <h2 mat-dialog-title>Trocar senha</h2>

  <form [formGroup]="form" (ngSubmit)="salvar()">
    <mat-form-field appearance="fill">
      <mat-label>Nova senha</mat-label>
      <input matInput type="password" formControlName="senha" />
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Confirmar senha</mat-label>
      <input matInput type="password" formControlName="confirmacao" />
    </mat-form-field>

    <div style="color:red" *ngIf="erro">As senhas não conferem</div>

    <div style="margin-top: 15px; text-align: right;">
      <button mat-button type="button" (click)="fechar()">Cancelar</button>
      <button mat-raised-button color="primary" type="submit">Salvar</button>
    </div>
  </form>
`,

styles: [`
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-right: 10px;
  }
  mat-form-field {
    width: 300px;
    height: 60px;  /* atenção: altura grande */
    margin-bottom: 12px;
    display: block;
  }
  mat-form-field input { 
    font-size: 16px;
    height: 30px; /* controla a altura do input */
  }
  h2[mat-dialog-title] {
    text-align: center;
    margin-bottom: 20px;
  }
`]

})
export class ChangePasswordDialogComponent {

  erro = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>
  ) {
    this.form = this.fb.group({
      senha: ['', Validators.required],
      confirmacao: ['', Validators.required]
    });
  }

  salvar() {
    const { senha, confirmacao } = this.form.value;

    if (senha !== confirmacao) {
      this.erro = true;
      return;
    }

    this.authService.trocarSenha(senha).subscribe({
      next: () => this.dialogRef.close(true)
    });
  }

  fechar() {
    this.dialogRef.close();
  }
}

