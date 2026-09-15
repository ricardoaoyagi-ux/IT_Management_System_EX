import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RcaService } from './rca.service';
import { RCA } from './rca.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator'; // paginação (opcional)
import { MatSortModule } from '@angular/material/sort';           // ordenação (opcional)


@Component({
  selector: 'app-rca',
  standalone: true,
  imports: [
  CommonModule,
  ReactiveFormsModule,
  MatTableModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatPaginatorModule, // se você tiver paginação
  MatSortModule       // se você tiver ordenação
  ],
  template: `
    <div class="container">
      <h2>RCA</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-rca">

        <mat-form-field>
          <input matInput type="number" placeholder="Cod RCA" formControlName="Cod_RCA">
        </mat-form-field>

        <mat-form-field>
          <input matInput type="number" placeholder="Cod Problem" formControlName="Cod_Problem">
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Descrição RCA" formControlName="Desc_RCA">
        </mat-form-field>

        <mat-form-field>
          <input matInput type="date" formControlName="Dt_Inicio">
        </mat-form-field>

        <mat-form-field>
          <input matInput type="date" formControlName="Dt_Conclusao">
        </mat-form-field>

        <mat-form-field>
          <input matInput type="number" placeholder="Horas Dev" formControlName="Tot_Hors_dev">
        </mat-form-field>

        <mat-form-field>
          <input matInput type="number" placeholder="Horas Orçadas" formControlName="Tot_Hors_orc">
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

        <ng-container matColumnDef="Cod_RCA">
          <th mat-header-cell *matHeaderCellDef>Cod RCA</th>
          <td mat-cell *matCellDef="let e">{{ e.Cod_RCA }}</td>
        </ng-container>

        <ng-container matColumnDef="Cod_Problem">
          <th mat-header-cell *matHeaderCellDef>Cod Problem</th>
          <td mat-cell *matCellDef="let e">{{ e.Cod_Problem }}</td>
        </ng-container>

        <ng-container matColumnDef="Desc_RCA">
          <th mat-header-cell *matHeaderCellDef>Descrição</th>
          <td mat-cell *matCellDef="let e">{{ e.Desc_RCA }}</td>
        </ng-container>

<ng-container matColumnDef="Dt_Inicio">
  <th mat-header-cell *matHeaderCellDef>Início</th>
  <td mat-cell *matCellDef="let e">{{ e.Dt_Inicio }}</td>
</ng-container>

<ng-container matColumnDef="Dt_Conclusao">
  <th mat-header-cell *matHeaderCellDef>Conclusão</th>
  <td mat-cell *matCellDef="let e">{{ e.Dt_Conclusao }}</td>
</ng-container>

<ng-container matColumnDef="Tot_Hors_dev">
  <th mat-header-cell *matHeaderCellDef>Horas Dev</th>
  <td mat-cell *matCellDef="let e">{{ e.Tot_Hors_dev }}</td>
</ng-container>

<ng-container matColumnDef="Tot_Hors_orc">
  <th mat-header-cell *matHeaderCellDef="Tot_Hors_orc">Horas Orc</th>
  <td mat-cell *matCellDef="let e">{{ e.Tot_Hors_orc }}</td>
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
    .form-rca { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
    mat-form-field { width: 180px; }
    table { width: 100%; }
  `]
})
export class RcaComponent implements OnInit {

  form: FormGroup;
  lista: RCA[] = [];
  displayedColumns = [
    'Id',
    'Cod_RCA',
    'Cod_Problem',
    'Desc_RCA',
    'Dt_Inicio',
    'Dt_Conclusao',
    'Tot_Hors_dev',
    'Tot_Hors_orc',
    'actions'
  ];
  editingId: number | null = null;

  constructor(private fb: FormBuilder, private rcaService: RcaService) {
    this.form = this.fb.group({
      Cod_RCA: [{ value: null, disabled: true }], // 🔒 bloqueado
      Cod_Problem: [null, Validators.required],
      Desc_RCA: [''],
      Dt_Inicio: [''],
      Dt_Conclusao: [''],
      Tot_Hors_dev: [null],
      Tot_Hors_orc: [null]
    });
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.rcaService.listar().subscribe(dados => this.lista = dados);
  }

  onSubmit() {
    const rca: RCA = this.form.getRawValue();
  
    delete (rca as any).Cod_RCA; // garantia extra
  
    if (this.editingId) {
      this.rcaService.atualizar(this.editingId, rca).subscribe(() => {
        this.form.reset();
        this.editingId = null;
        this.carregar();
      });
    } else {
      this.rcaService.criar(rca).subscribe(() => {
        this.form.reset();
        this.carregar();
      });
    }
  }

  editar(rca: RCA) {
    this.editingId = rca.Id ?? null;
    this.form.patchValue(rca);
  }

  cancelarEdicao() {
    this.editingId = null;
    this.form.reset();
  }

  deletar(id: number) {
    this.rcaService.deletar(id).subscribe(() => this.carregar());
  }
}
