import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SistemaService } from './sistema.service';
import { Sistema } from './sistema.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-sistema',
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
      <h2>Sistemas</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-sistema">

        <mat-form-field>
          <input matInput placeholder="Código do Sistema"
                 formControlName="Cod_Sistema" type="number">
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Nome do Sistema"
                 formControlName="Nom_Sistema">
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
          <td mat-cell *matCellDef="let element">{{ element.Id }}</td>
        </ng-container>

        <ng-container matColumnDef="Cod_Sistema">
          <th mat-header-cell *matHeaderCellDef>Código</th>
          <td mat-cell *matCellDef="let element">{{ element.Cod_Sistema }}</td>
        </ng-container>

        <ng-container matColumnDef="Nom_Sistema">
          <th mat-header-cell *matHeaderCellDef>Nome</th>
          <td mat-cell *matCellDef="let element">{{ element.Nom_Sistema }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Ações</th>
          <td mat-cell *matCellDef="let element">
            <button mat-button color="accent" (click)="editar(element)">Editar</button>
            <button mat-button color="warn" (click)="deletar(element.Id!)">Excluir</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; padding-top: 60px;}
    .form-sistema {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    mat-form-field { width: 200px; }
    table { width: 100%; }
    button { margin-right: 5px; }
  `]
})
export class SistemaComponent implements OnInit {

  form: FormGroup;
  lista: Sistema[] = [];
  displayedColumns = ['Id', 'Cod_Sistema', 'Nom_Sistema', 'actions'];
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private sistemaService: SistemaService
  ) {
    this.form = this.fb.group({
      Cod_Sistema: [null, Validators.required],
      Nom_Sistema: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.sistemaService.listar().subscribe(dados => {
      this.lista = dados;
    });
  }

  onSubmit() {
    const sistema: Sistema = this.form.value;

    if (this.editingId) {
      this.sistemaService.atualizar(this.editingId, sistema).subscribe(() => {
        this.cancelarEdicao();
        this.carregar();
      });
    } else {
      this.sistemaService.criar(sistema).subscribe(() => {
        this.form.reset();
        this.carregar();
      });
    }
  }

  editar(s: Sistema) {
    this.editingId = s.Id ?? null;
    this.form.patchValue(s);
  }

  cancelarEdicao() {
    this.editingId = null;
    this.form.reset();
  }

  deletar(id: number) {
    this.sistemaService.deletar(id).subscribe(() => {
      this.carregar();
    });
  }
}
