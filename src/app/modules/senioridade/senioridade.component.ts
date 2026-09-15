import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SenioridadeService } from './senioridade.service';
import { Senioridade } from './senioridade.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-senioridade',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './senioridade.component.html',
  styleUrls: ['./senioridade.component.css'],
})
export class SenioridadeComponent implements OnInit {

  form: FormGroup;
  lista: Senioridade[] = [];
  displayedColumns = ['ID_Senioridade', 'Categoria', 'Cat', 'actions'];
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private senioridadeService: SenioridadeService
  ) {
    this.form = this.fb.group({
      Categoria: ['', Validators.required],
      Cat: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.senioridadeService.listar().subscribe(dados => {
      this.lista = dados;
    });
  }

  onSubmit() {
    const senioridade: Senioridade = this.form.value;

    if (this.editingId) {
      this.senioridadeService.atualizar(this.editingId, senioridade).subscribe(() => {
        this.form.reset();
        this.editingId = null;
        this.carregar();
      });
    } else {
      this.senioridadeService.criar(senioridade).subscribe(() => {
        this.form.reset();
        this.carregar();
      });
    }
  }

  editar(s: Senioridade) {
    this.editingId = s.ID_Senioridade ?? null;
    this.form.patchValue(s);
  }

  cancelarEdicao() {
    this.editingId = null;
    this.form.reset();
  }

  deletar(id: number) {
    this.senioridadeService.deletar(id).subscribe(() => {
      this.carregar();
    });
  }
}
