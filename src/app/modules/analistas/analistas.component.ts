import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AnalistasService } from './analistas.service';
import { Analista } from './analistas.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-analistas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule 
  ],
  templateUrl: './analistas.component.html',
  styleUrls: ['./analistas.component.css']
})
export class AnalistasComponent implements OnInit {
  usuarioLogado = '';
  alocacoes: { Cod_alocacao: number; Desc_alocacao: string }[] = []; 
  senioridades: { ID_Senioridade: number; Categoria: string; Cat: string }[] = [];


  form: FormGroup;
  lista: Analista[] = [];
  displayedColumns = [
    'Id_Analista',
    'Matricula',
    'Nom_Analista',
    'Lider_Gerente', // 👈 NOVO
    'NOM_USUARIO_SIG',
    'CID_RESIDENCIA',
    'UF_RESIDENCIA',
    'Id_Fornecedor',
    'Id_Cliente',
    'Alocacao',
    'Senioridade',
    'Dt_Inicio',
    'Dt_Fim',
    'actions'
  ];
  
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private analistasService: AnalistasService
  ) {
    this.form = this.fb.group({
      Matricula: [null, Validators.required],
      Nom_Analista: ['', Validators.required],
      Lider_Gerente: ['', Validators.required], // 👈 NOVO CAMPO
      
  // 🔒 novo campo SIG (bloqueado)
  NOM_USUARIO_SIG: [{ value: '', disabled: true }],

  CID_RESIDENCIA: ['', Validators.required],
  UF_RESIDENCIA: ['', Validators.required],

      Id_Fornecedor: ['', Validators.required],
      Id_Cliente: ['', Validators.required],
      Alocacao: ['', Validators.required],
      Senioridade: ['', Validators.required], 
      Dt_Inicio: ['', Validators.required],
      Dt_Fim: [''],
      // 🔒 campos de auditoria (ocultos)
      Dt_Atualizacao: [''],
      Id_Atualizacao: ['']
    });
  }
 
  ngOnInit() {
    const userStr = localStorage.getItem('user');
  
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.usuarioLogado = user.username;
      } catch (e) {
        console.error('Erro ao ler usuário do localStorage', e);
      }
    }
    this.carregar();
    this.carregarAlocacoes(); 
    this.carregarSenioridades(); // 👈 novo
  }
  
  carregarAlocacoes() {
    this.analistasService.getAlocacao().subscribe(dados => {
      this.alocacoes = dados;
    });
  }
   
  carregarSenioridades() {
    this.analistasService.getSenioridades().subscribe(dados => {
      this.senioridades = dados;
    });
  }

  carregar() {
    this.analistasService.listar().subscribe(dados => {
      this.lista = dados;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.editingId) {
      return;
    }
  
    this.form.patchValue({
      Dt_Atualizacao: new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
      Id_Atualizacao: this.usuarioLogado
    });
  
    const analista = {
      ...this.form.getRawValue(),
      Rate: 0
    };
  
    this.analistasService
      .atualizar(this.editingId, analista)
      .subscribe(() => {
        this.cancelarEdicao();
        this.carregar();
      });
  }
 
    editar(a: Analista) {
      this.editingId = a.Id_Analista ?? null;
    
      const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';
    
      this.form.patchValue({
        ...a,
        Dt_Inicio: formatDate(a.Dt_Inicio),
        Dt_Fim: formatDate(a.Dt_Fim)
      });
  // 🔓 garante que Nom_Analista esteja habilitado
  this.form.get('Nom_Analista')?.enable();

  // 🔒 garante que o SIG continue bloqueado
  this.form.get('NOM_USUARIO_SIG')?.disable();
    }

  cancelarEdicao() {
    this.editingId = null;
    this.form.reset();
  }

  deletar(Id_Analista: number) {
    this.analistasService.deletar(Id_Analista).subscribe(() => {
      this.carregar();
    });
  }
}
