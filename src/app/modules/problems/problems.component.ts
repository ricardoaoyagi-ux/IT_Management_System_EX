import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProblemsService } from './problems.service';
import { Problem } from './problems.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-problems',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.css']
})
export class ProblemsComponent implements OnInit {

  form: FormGroup;
  lista: Problem[] = [];
  displayedColumns = [
    'Id', 'Cod_Problem', 'Nom_Problem', 'Desc_Problem',
    'Dt_Abertura', 'Dt_Encerramento',
    'Status', 'Tip_Problem', 'PM_CLIENTE',
    'Analista_Cadastro', 'Analista_Responsavel', 'actions'
  ];
  editingId: number | null = null;

  constructor(private fb: FormBuilder, private problemsService: ProblemsService) {
    this.form = this.fb.group({
      Cod_Problem:  [{ value: null, disabled: true }], // 🔒 bloqueado
      Nom_Problem: ['', Validators.required],
      Desc_Problem: [''],
      Dt_Abertura:  [{ value: null, disabled: true }],
      Dt_Encerramento: [''],
      Status: [null],
      Tip_Problem: [null],
      PM_CLIENTE: [''],
      Analista_Cadastro:  [{ value: null, disabled: true }],
      Analista_Responsavel: ['']
    });
  }

  ngOnInit() {
    const usuario = this.getUsuarioLogado();
  
    if (usuario) {
      this.form.get('Analista_Cadastro')?.setValue(usuario);
    }
  
    this.carregar();
  }

  carregar() {
    this.problemsService.listar().subscribe(dados => {
      this.lista = dados;
    });
  }

  onSubmit() {
    const usuario = this.getUsuarioLogado();
  
    if (usuario) {
      this.form.get('Analista_Cadastro')?.setValue(usuario);
    }
  
    const problem: Problem = this.form.getRawValue();
  
    if (this.editingId) {
      this.problemsService.atualizar(this.editingId, problem).subscribe(() => {
        this.form.reset();
        this.editingId = null;
        this.carregar();
      });
    } else {
      this.problemsService.criar(problem).subscribe(() => {
        this.form.reset();
        this.carregar();
      });
    }
  }
  

  editar(p: Problem) {
 

    this.editingId = p.Id ?? null;
    this.form.patchValue(p);
  }

  cancelarEdicao() {
    this.editingId = null;
    this.form.reset();
  }

  deletar(id: number) {
    this.problemsService.deletar(id).subscribe(() => {
      this.carregar();
    });
  }

  private getUsuarioLogado(): string | null {
    const userStr = localStorage.getItem('user');
  
    if (!userStr) {
      return null;
    }
  
    try {
      const user = JSON.parse(userStr);
      return user.username; // ajuste se o nome do campo for outro
    } catch (e) {
      console.error('Erro ao ler usuário do localStorage', e);
      return null;
    }
  }
}
