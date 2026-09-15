import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TimeboxProjeto } from './timebox.model';

@Component({
  selector: 'app-projeto-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Projeto' : 'Novo Projeto' }}</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-projeto">
      <mat-form-field appearance="fill">
        <mat-label>Nome</mat-label>
        <input matInput formControlName="Nome" required>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Descrição</mat-label>
        <input matInput formControlName="Descricao">
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Horas Previstas</mat-label>
        <input matInput type="number" formControlName="HorasPrevistas" required>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Data Início</mat-label>
        <input matInput type="date" formControlName="DataInicio">
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Data Previsão Fim</mat-label>
        <input matInput type="date" formControlName="DataPrevisaoFim">
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Data Fim Real</mat-label>
        <input matInput type="date" formControlName="DataFimReal">
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Status</mat-label>
        <mat-select formControlName="Status">
          <mat-option value="PLANEJADO">PLANEJADO</mat-option>
          <mat-option value="EM_ANDAMENTO">EM ANDAMENTO</mat-option>
          <mat-option value="CONCLUIDO">CONCLUIDO</mat-option>
          <mat-option value="CANCELADO">CANCELADO</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="botoes">
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{ data ? 'Atualizar' : 'Adicionar' }}
        </button>
        <button mat-raised-button color="warn" type="button" (click)="dialogRef.close()">Cancelar</button>
      </div>
    </form>
  `,
  styles: [`
    .form-projeto { display: flex; flex-direction: column; gap: 15px; padding: 10px; }
    .botoes { display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px; }
    mat-form-field { width: 100%; }
  `]
})
export class ProjetoDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjetoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TimeboxProjeto | null
  ) {
    this.form = this.fb.group({
      Nome: [data?.Nome ?? '', Validators.required],
      Descricao: [data?.Descricao ?? ''],
      HorasPrevistas: [data?.HorasPrevistas ?? 0, [Validators.required, Validators.min(1)]],
      DataInicio: [data?.DataInicio ? formatDateForInput(data.DataInicio) : ''],
      DataPrevisaoFim: [data?.DataPrevisaoFim ? formatDateForInput(data.DataPrevisaoFim) : ''],
      DataFimReal: [data?.DataFimReal ? formatDateForInput(data.DataFimReal) : ''],
      Status: [data?.Status ?? 'PLANEJADO']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const projeto: TimeboxProjeto = { ...this.data, ...this.form.value };
      this.dialogRef.close(projeto);
    }
  }
}

// Função auxiliar para formatar datas para o input type="date"
function formatDateForInput(dateString: string | Date): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
