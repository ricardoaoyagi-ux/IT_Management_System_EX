import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AplicacoesService } from './aplicacoes.service';
import { Aplicacao } from './aplicacoes.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-aplicacoes',
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
      <h2>Aplicações</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-aplicacao">
        <mat-form-field>
          <input matInput placeholder="ID Aplicação" formControlName="Id_Aplicacao" type="number">
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Nome Aplicação" formControlName="Nom_Aplicacao">
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit">
          {{ editingCodigo ? 'Atualizar' : 'Adicionar' }}
        </button>

        <button *ngIf="editingCodigo" mat-raised-button color="warn" type="button" (click)="cancelarEdicao()">
          Cancelar
        </button>
      </form>

      <table mat-table [dataSource]="lista" class="mat-elevation-z8">
        <ng-container matColumnDef="Codigo">
          <th mat-header-cell *matHeaderCellDef> Código </th>
          <td mat-cell *matCellDef="let element"> {{element.Codigo}} </td>
        </ng-container>

        <ng-container matColumnDef="Id_Aplicacao">
          <th mat-header-cell *matHeaderCellDef> ID Aplicação </th>
          <td mat-cell *matCellDef="let element"> {{element.Id_Aplicacao}} </td>
        </ng-container>

        <ng-container matColumnDef="Nom_Aplicacao">
          <th mat-header-cell *matHeaderCellDef> Nome </th>
          <td mat-cell *matCellDef="let element"> {{element.Nom_Aplicacao}} </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Ações </th>
          <td mat-cell *matCellDef="let element">
            <button mat-button color="accent" (click)="editar(element)">Editar</button>
            <button mat-button color="warn" (click)="deletar(element.Codigo)">Excluir</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; padding-top: 60px;}
    .form-aplicacao { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
    mat-form-field { width: 150px; }
    table { width: 100%; }
    button { margin-right: 5px; }
  `]
})
export class AplicacoesComponent implements OnInit {
  form: FormGroup;
  lista: Aplicacao[] = [];
  displayedColumns = ['Codigo', 'Id_Aplicacao', 'Nom_Aplicacao', 'actions'];
  editingCodigo: number | null = null;

  constructor(private fb: FormBuilder, private service: AplicacoesService) {
    this.form = this.fb.group({
      Id_Aplicacao: [null, Validators.required],
      Nom_Aplicacao: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe(dados => this.lista = dados);
  }

  onSubmit() {
    const aplicacao: Aplicacao = this.form.value;

    if (this.editingCodigo) {
      this.service.atualizar(this.editingCodigo, aplicacao).subscribe(() => {
        this.carregar();
        this.cancelarEdicao();
      });
    } else {
      this.service.criar(aplicacao).subscribe(() => {
        this.form.reset();
        this.carregar();
      });
    }
  }

  editar(a: Aplicacao) {
    this.editingCodigo = a.Codigo!;
    this.form.patchValue(a);
  }

  cancelarEdicao() {
    this.editingCodigo = null;
    this.form.reset();
  }

  deletar(codigo: number) {
    this.service.deletar(codigo).subscribe(() => this.carregar());
  }
}
