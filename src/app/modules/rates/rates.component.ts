import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RatesService } from './rates.service';
import { Rate } from './rates.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-rates',
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
      <h2>Rates</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-rates">
        <mat-form-field>
          <input matInput placeholder="Rate" formControlName="Rate" type="number">
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Valor" formControlName="Valor" type="number">
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Especialidade" formControlName="Especialidade">
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

        <ng-container matColumnDef="Rate">
          <th mat-header-cell *matHeaderCellDef> Rate </th>
          <td mat-cell *matCellDef="let element"> {{element.Rate}} </td>
        </ng-container>

        <ng-container matColumnDef="Valor">
          <th mat-header-cell *matHeaderCellDef> Valor </th>
          <td mat-cell *matCellDef="let element"> {{element.Valor}} </td>
        </ng-container>

        <ng-container matColumnDef="Especialidade">
          <th mat-header-cell *matHeaderCellDef> Especialidade </th>
          <td mat-cell *matCellDef="let element"> {{element.Especialidade}} </td>
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
    .form-rates { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
    mat-form-field { width: 150px; }
    table { width: 100%; }
    button { margin-right: 5px; }
  `]
})
export class RatesComponent implements OnInit {

  form: FormGroup;
  lista: Rate[] = [];
  displayedColumns = ['Id', 'Rate', 'Valor', 'Especialidade', 'actions'];
  editingId: number | null = null;

  constructor(private fb: FormBuilder, private ratesService: RatesService) {
    this.form = this.fb.group({
      Rate: [null, Validators.required],
      Valor: [null, Validators.required],
      Especialidade: ['']
    });
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.ratesService.listar().subscribe(dados => {
      this.lista = dados;
    });
  }

  onSubmit() {
    const rate: Rate = this.form.value;

    if (this.editingId) {
      this.ratesService.atualizar(this.editingId, rate).subscribe(() => {
        this.form.reset();
        this.editingId = null;
        this.carregar();
      });
    } else {
      this.ratesService.criar(rate).subscribe(() => {
        this.form.reset();
        this.carregar();
      });
    }
  }

  editar(rate: Rate) {
    this.editingId = rate.Id ?? null;
    this.form.patchValue(rate);
  }

  cancelarEdicao() {
    this.editingId = null;
    this.form.reset();
  }

  deletar(id: number) {
    this.ratesService.deletar(id).subscribe(() => {
      this.carregar();
    });
  }
}
