import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { TimeboxProjetoParticipacao } from './timebox.model';
import { TimeboxService } from './timebox.service'; 

export interface Analista {
  Id_Analista: number;
  Nom_Analista: string;
}

@Component({
  selector: 'app-membro-dialog',
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
    <h2 mat-dialog-title>
      {{ isEdicao ? 'Editar Membro' : 'Vincular Membro' }}
    </h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-membro">

      <mat-form-field appearance="fill">
        <mat-label>Analista</mat-label>
        <mat-select formControlName="UserId" required>
          <mat-option *ngFor="let a of analistas" [value]="a.Id_Analista">
            {{ a.Nom_Analista }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Papel no Projeto</mat-label>
        <input matInput formControlName="Papel">
      </mat-form-field>

<mat-form-field appearance="fill">
  <mat-label>Data Início</mat-label>
  <input matInput type="date" formControlName="DataInicio">
</mat-form-field>

<mat-form-field appearance="fill">
  <mat-label>Data Fim</mat-label>
  <input matInput type="date" formControlName="DataFim">
</mat-form-field>

<mat-form-field appearance="fill">
  <mat-label>Horas por dia</mat-label>
  <input
    matInput
    type="number"
    formControlName="HorasPorDia"
    min="0.25"
    step="0.25"
  >
</mat-form-field>

      <div class="botoes">
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{ isEdicao ? 'Atualizar' : 'Adicionar' }}
        </button>
        <button mat-raised-button color="warn" type="button" (click)="dialogRef.close()">
          Cancelar
        </button>
      </div>

    </form>
  `,
  styles: [`
    .form-membro {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 10px;
    }
    .botoes {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 10px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class MembroDialogComponent implements OnInit {

  form: FormGroup;
  isEdicao = false;
  analistas: Analista[] = [];

  constructor(
    private fb: FormBuilder,
    private timeboxService: TimeboxService,
    public dialogRef: MatDialogRef<MembroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdicao = !!data?.Id;

this.form = this.fb.group({
  UserId: [data?.UserId ?? null, Validators.required],
  Papel: [data?.Papel ?? ''],

  DataInicio: [formatDateForInput(data?.DataInicio) ?? null, Validators.required],
  DataFim: [formatDateForInput(data?.DataFim) ?? null, Validators.required],

  HorasPorDia: [
    data?.HorasPorDia ?? 0,
    [Validators.required, Validators.min(0.25)]
  ],

  TimeboxProjetoId: [data?.TimeboxProjetoId, Validators.required]
});
  }

  ngOnInit(): void {
    this.timeboxService.listarAnalistas().subscribe(lista => {
      this.analistas = lista;
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const membro: Partial<TimeboxProjetoParticipacao> = {
        ...this.data,
        ...this.form.value
      };
      this.dialogRef.close(membro);
    }
  }



}


// Função utilitária
function formatDateForInput(dateString?: string | null): string | null {
  if (!dateString) return null;
  const d = new Date(dateString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}