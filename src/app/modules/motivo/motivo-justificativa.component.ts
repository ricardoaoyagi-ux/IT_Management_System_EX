import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MotivoJustificativaService } from './motivo-justificativa.service';
import { MotivoJustificativa } from './motivo-justificativa.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-motivo-justificativa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
    <div class="container">
      <h2>Motivos de Justificativa</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-motivo">

        <mat-form-field appearance="outline">
          <input matInput placeholder="Descrição" formControlName="descricao">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-select placeholder="Abono" formControlName="abono">
            <mat-option value="S">Sim</mat-option>
            <mat-option value="N">Não</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-select placeholder="Tipo do Motivo" formControlName="tipo_motivo">
            <mat-option value="SLA">SLA</mat-option>
            <mat-option value="REABERTURA">Reabertura</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-select placeholder="Ativo" formControlName="ativo">
            <mat-option value="S">Sim</mat-option>
            <mat-option value="N">Não</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit">
          {{ editingId ? 'Atualizar' : 'Adicionar' }}
        </button>

        <button *ngIf="editingId"
                mat-raised-button
                color="warn"
                type="button"
                (click)="cancelarEdicao()">
          Cancelar
        </button>
      </form>

      <table mat-table [dataSource]="lista" class="mat-elevation-z8">

        <ng-container matColumnDef="cod_motivo">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let e">{{ e.cod_motivo }}</td>
        </ng-container>

        <ng-container matColumnDef="descricao">
          <th mat-header-cell *matHeaderCellDef>Descrição</th>
          <td mat-cell *matCellDef="let e">{{ e.descricao }}</td>
        </ng-container>

        <ng-container matColumnDef="abono">
          <th mat-header-cell *matHeaderCellDef>Abono</th>
          <td mat-cell *matCellDef="let e">{{ e.abono }}</td>
        </ng-container>

        <ng-container matColumnDef="tipo_motivo">
          <th mat-header-cell *matHeaderCellDef>Tipo</th>
          <td mat-cell *matCellDef="let e">{{ e.tipo_motivo }}</td>
        </ng-container>

        <ng-container matColumnDef="ativo">
          <th mat-header-cell *matHeaderCellDef>Ativo</th>
          <td mat-cell *matCellDef="let e">{{ e.ativo }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Ações</th>
          <td mat-cell *matCellDef="let e">
            <button mat-button color="accent" (click)="editar(e)">Editar</button>
            <button mat-button color="warn" (click)="deletar(e.cod_motivo!)">Excluir</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; padding-top: 60px; }
    .form-motivo { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
    mat-form-field { width: 260px; }
    table { width: 100%; }
  `]
})
export class MotivoJustificativaComponent implements OnInit {

  form: FormGroup;
  lista: MotivoJustificativa[] = [];
  editingId: number | null = null;

  displayedColumns = [
    'cod_motivo',
    'descricao',
    'abono',
    'tipo_motivo',
    'ativo',
    'actions'
  ];

  constructor(
    private fb: FormBuilder,
    private service: MotivoJustificativaService
  ) {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
      abono: ['N', Validators.required],
      tipo_motivo: ['', Validators.required],
      ativo: ['S', Validators.required]
    });
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe(dados => this.lista = dados);
  }

  onSubmit() {
    const motivo: MotivoJustificativa = this.form.value;

    if (this.editingId) {
      this.service.atualizar(this.editingId, motivo).subscribe(() => {
        this.resetForm();
        this.carregar();
      });
    } else {
      this.service.criar(motivo).subscribe(() => {
        this.resetForm();
        this.carregar();
      });
    }
  }

  editar(item: MotivoJustificativa) {
    this.editingId = item.cod_motivo ?? null;
    this.form.patchValue(item);
  }

  cancelarEdicao() {
    this.resetForm();
  }

  deletar(id: number) {
    this.service.deletar(id).subscribe(() => this.carregar());
  }

  private resetForm() {
    this.editingId = null;
    this.form.reset({
      abono: 'N',
      ativo: 'S'
    });
  }
}
