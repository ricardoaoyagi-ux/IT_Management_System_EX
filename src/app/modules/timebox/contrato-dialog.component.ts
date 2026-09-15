import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TimeboxContrato } from './timebox.model';

@Component({
  selector: 'app-contrato-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Contrato' : 'Novo Contrato' }}</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-contrato">
      <mat-form-field appearance="fill">
        <mat-label>Descrição</mat-label>
        <input matInput formControlName="Descricao" required>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Horas Contratadas</mat-label>
        <input matInput type="number" formControlName="HorasContratadas" required>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Data Início</mat-label>
        <input matInput type="date" formControlName="DataInicio">
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Data Fim</mat-label>
        <input matInput type="date" formControlName="DataFim">
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
    .form-contrato { display: flex; flex-direction: column; gap: 15px; padding: 10px; }
    .botoes { display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px; }
    mat-form-field { width: 100%; }
  `]
})
export class ContratoDialogComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ContratoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TimeboxContrato | null
  ) {
    this.form = this.fb.group({
      Descricao: [data?.Descricao ?? '', Validators.required],
      HorasContratadas: [data?.HorasContratadas ?? 0, [Validators.required, Validators.min(1)]],
    DataInicio: [data?.DataInicio ? formatDateForInput(data.DataInicio) : ''],
    DataFim: [data?.DataFim ? formatDateForInput(data.DataFim) : '']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const contrato: TimeboxContrato = { ...this.data, ...this.form.value };
      this.dialogRef.close(contrato);
    }
  }


}


  function formatDateForInput(dateString: string | Date): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // meses 0-11
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
