import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TipProblemService } from './tip_problem.service';
import { TipProblem } from './tip_problem.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-tip-problem',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <div class="container">
      <h2>Tip Problem</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-tip">

        <mat-form-field>
          <input matInput type="number" placeholder="Tip Problem" formControlName="Tip_Problem">
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Descrição" formControlName="Desc_Tip_Problem">
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

        <ng-container *ngFor="let col of displayedColumns" [matColumnDef]="col">
          <th mat-header-cell *matHeaderCellDef>{{ col }}</th>
          <td mat-cell *matCellDef="let e">{{ e[col] }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Ações</th>
          <td mat-cell *matCellDef="let e">
            <button mat-button color="accent" (click)="editar(e)">Editar</button>
            <button mat-button color="warn" (click)="deletar(e.Id!)">Excluir</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumnsWithActions"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumnsWithActions;"></tr>

      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; padding-top: 60px;}
    .form-tip { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
    mat-form-field { width: 200px; }
    table { width: 100%; }
  `]
})
export class TipProblemComponent implements OnInit {

  form: FormGroup;
  lista: TipProblem[] = [];
  editingId: number | null = null;

  displayedColumns = ['Id', 'Tip_Problem', 'Desc_Tip_Problem'];
  displayedColumnsWithActions = [...this.displayedColumns, 'actions'];

  constructor(
    private fb: FormBuilder,
    private service: TipProblemService
  ) {
    this.form = this.fb.group({
      Tip_Problem: [null, Validators.required],
      Desc_Tip_Problem: ['']
    });
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe(dados => this.lista = dados);
  }

  onSubmit() {
    const item: TipProblem = this.form.value;

    if (this.editingId) {
      this.service.atualizar(this.editingId, item).subscribe(() => {
        this.form.reset();
        this.editingId = null;
        this.carregar();
      });
    } else {
      this.service.criar(item).subscribe(() => {
        this.form.reset();
        this.carregar();
      });
    }
  }

  editar(item: TipProblem) {
    this.editingId = item.Id ?? null;
    this.form.patchValue(item);
  }

  cancelarEdicao() {
    this.editingId = null;
    this.form.reset();
  }

  deletar(id: number) {
    this.service.deletar(id).subscribe(() => this.carregar());
  }
}
