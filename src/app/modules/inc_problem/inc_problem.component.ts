import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IncProblemService } from './inc_problem.service';
import { IncProblem } from './inc_problem.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-inc-problem',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './inc_problem.component.html',
  styleUrls: ['./inc_problem.component.css']
})
export class IncProblemComponent implements OnInit {
  form: FormGroup;
  lista: IncProblem[] = [];
  displayedColumns = ['Id', 'Cod_Problem', 'Id_Incidente', 'actions'];
  editingId: number | null = null;

  constructor(private fb: FormBuilder, private service: IncProblemService) {
    this.form = this.fb.group({
      Cod_Problem: [null, Validators.required],
      Id_Incidente: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe(dados => this.lista = dados);
  }

  onSubmit() {
    const incProblem: IncProblem = this.form.value;

    if (this.editingId) {
      this.service.atualizar(this.editingId, incProblem).subscribe(() => {
        this.carregar();
        this.cancelarEdicao();
      });
    } else {
      this.service.criar(incProblem).subscribe(() => {
        this.form.reset();
        this.carregar();
      });
    }
  }

  editar(ip: IncProblem) {
    this.editingId = ip.Id!;
    this.form.patchValue(ip);
  }

  cancelarEdicao() {
    this.editingId = null;
    this.form.reset();
  }

  deletar(id: number) {
    this.service.deletar(id).subscribe(() => this.carregar());
  }
}
