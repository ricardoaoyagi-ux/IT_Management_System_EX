import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AlocacaoService } from './alocacao.service';
import { Alocacao } from './alocacao.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-alocacao',
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
      <h2>Alocações</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-alocacao">

        <mat-form-field>
          <input matInput placeholder="Código"
                 formControlName="Cod_Alocacao" type="number">
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Descrição"
                 formControlName="Desc_Alocacao">
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

        <ng-container matColumnDef="Cod_Alocacao">
          <th mat-header-cell *matHeaderCellDef>Código</th>
          <td mat-cell *matCellDef="let e">{{ e.Cod_Alocacao }}</td>
        </ng-container>

        <ng-container matColumnDef="Desc_Alocacao">
          <th mat-header-cell *matHeaderCellDef>Descrição</th>
          <td mat-cell *matCellDef="let e">{{ e.Desc_Alocacao }}</td>
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
    .form-alocacao {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    mat-form-field { width: 220px; }
    table { width: 100%; }
  `]
})
export class AlocacaoComponent implements OnInit {

  form: FormGroup;
  lista: Alocacao[] = [];
  displayedColumns = ['Id', 'Cod_Alocacao', 'Desc_Alocacao', 'actions'];
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private alocacaoService: AlocacaoService
  ) {
    this.form = this.fb.group({
      Cod_Alocacao: [null, Validators.required],
      Desc_Alocacao: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.alocacaoService.listar().subscribe(dados => {
      this.lista = dados;
    });
  }

  onSubmit() {
    const alocacao: Alocacao = this.form.value;

    if (this.editingId) {
      this.alocacaoService.atualizar(this.editingId, alocacao).subscribe(() => {
        this.cancelarEdicao();
        this.carregar();
      });
    } else {
      this.alocacaoService.criar(alocacao).subscribe(() => {
        this.form.reset();
        this.carregar();
      });
    }
  }

  editar(a: Alocacao) {
    this.editingId = a.Id ?? null;
    this.form.patchValue(a);
  }

  cancelarEdicao() {
    this.editingId = null;
    this.form.reset();
  }

  deletar(id: number) {
    this.alocacaoService.deletar(id).subscribe(() => {
      this.carregar();
    });
  }
}
