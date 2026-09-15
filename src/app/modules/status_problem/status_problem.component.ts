import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StatusProblemService } from './status_problem.service';
import { StatusProblem } from './status_problem.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-status-problem',
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
      <h2>Status Problem</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-status">

        <mat-form-field>
          <input matInput type="number" placeholder="Status" formControlName="Status">
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Descrição" formControlName="Desc_Status">
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

        <ng-container matColumnDef="Id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let e">{{ e.Id }}</td>
        </ng-container>

        <ng-container matColumnDef="Status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let e">{{ e.Status }}</td>
        </ng-container>

        <ng-container matColumnDef="Desc_Status">
          <th mat-header-cell *matHeaderCellDef>Descrição</th>
          <td mat-cell *matCellDef="let e">{{ e.Desc_Status }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Ações</th>
          <td mat-cell *matCellDef="let e">
            <button mat-button color="accent" (click)="editar(e)">Editar</button>
            <button mat-button color="warn" (click)="deletar(e.Id!)">Excluir</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; padding-top: 60px;}
    .form-status { display: flex; gap: 10px; margin-bottom: 20px; }
    mat-form-field { width: 200px; }
    table { width: 100%; }
  `]
})
export class StatusProblemComponent implements OnInit {

  form: FormGroup;
  lista: StatusProblem[] = [];
  editingId: number | null = null;

  displayedColumns = ['Id', 'Status', 'Desc_Status', 'actions'];

  constructor(
    private fb: FormBuilder,
    private service: StatusProblemService
  ) {
    this.form = this.fb.group({
      Status: [null, Validators.required],
      Desc_Status: ['']
    });
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe(dados => this.lista = dados);
  }

  onSubmit() {
    const status: StatusProblem = this.form.value;

    if (this.editingId) {
      this.service.atualizar(this.editingId, status).subscribe(() => {
        this.form.reset();
        this.editingId = null;
        this.carregar();
      });
    } else {
      this.service.criar(status).subscribe(() => {
        this.form.reset();
        this.carregar();
      });
    }
  }

  editar(item: StatusProblem) {
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
