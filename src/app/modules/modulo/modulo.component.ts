import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModuloService } from './modulo.service';
import { Modulo } from './modulo.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-modulo',
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
      <h2>Módulos</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-modulo">
        <mat-form-field>
          <input matInput placeholder="Código do Sistema" formControlName="Cod_Sistema" type="number">
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Código do Módulo" formControlName="Cod_Modulo" type="number">
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Nome do Módulo" formControlName="Nom_Modulo">
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit">
          {{ editingId ? 'Atualizar' : 'Adicionar' }}
        </button>

        <button *ngIf="editingId" mat-raised-button color="warn" type="button" (click)="cancelarEdicao()">
          Cancelar
        </button>
      </form>

      <table mat-table [dataSource]="lista" class="mat-elevation-z8">
        <ng-container matColumnDef="Id">
          <th mat-header-cell *matHeaderCellDef> ID </th>
          <td mat-cell *matCellDef="let element"> {{element.Id}} </td>
        </ng-container>

        <ng-container matColumnDef="Cod_Sistema">
          <th mat-header-cell *matHeaderCellDef> Cod Sistema </th>
          <td mat-cell *matCellDef="let element"> {{element.Cod_Sistema}} </td>
        </ng-container>

        <ng-container matColumnDef="Cod_Modulo">
          <th mat-header-cell *matHeaderCellDef> Cod Módulo </th>
          <td mat-cell *matCellDef="let element"> {{element.Cod_Modulo}} </td>
        </ng-container>

        <ng-container matColumnDef="Nom_Modulo">
          <th mat-header-cell *matHeaderCellDef> Nome </th>
          <td mat-cell *matCellDef="let element"> {{element.Nom_Modulo}} </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Ações </th>
          <td mat-cell *matCellDef="let element">
            <button mat-button color="accent" (click)="editar(element)">Editar</button>
            <button mat-button color="warn" (click)="deletar(element.Id)">Excluir</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; padding-top: 60px;}
    .form-modulo { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
    mat-form-field { width: 150px; }
    table { width: 100%; }
    button { margin-right: 5px; }
  `]
})
export class ModuloComponent implements OnInit {

  form: FormGroup;
  lista: Modulo[] = [];
  displayedColumns = ['Id', 'Cod_Sistema', 'Cod_Modulo', 'Nom_Modulo', 'actions'];
  editingId: number | null = null;

  constructor(private fb: FormBuilder, private moduloService: ModuloService) {
    this.form = this.fb.group({
      Cod_Sistema: [null, Validators.required],
      Cod_Modulo: [null, Validators.required],
      Nom_Modulo: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.moduloService.listar().subscribe(dados => {
      this.lista = dados;
    });
  }

  onSubmit() {
    const modulo: Modulo = this.form.value;

    if (this.editingId) {
      this.moduloService.atualizar(this.editingId, modulo).subscribe(() => {
        window.location.reload(); // Reset completo após update
      });
    } else {
      this.moduloService.criar(modulo).subscribe(() => {
        this.form.reset();
        this.carregar(); // 🔹 Refresh da página
      });
    }
  }

  editar(m: Modulo) {
    this.editingId = m.Id ?? null;
    this.form.patchValue(m);
  }

  cancelarEdicao() {
    this.editingId = null;
    this.form.reset();
  }

  deletar(id: number) {
    this.moduloService.deletar(id).subscribe(() => {
        this.carregar(); // 🔹 Refresh da página
    });
  }
}
