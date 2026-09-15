import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeriasService } from './ferias.service';
import { Ferias } from './ferias.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-ferias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  templateUrl: './ferias.component.html',
  styleUrls: ['./ferias.component.css']
 
})
export class FeriasComponent implements OnInit {
  form: FormGroup;
  filtroForm: FormGroup;
  usuarioLogado: string = '';

  lista: Ferias[] = [];
  displayedColumns = ['Id', 'Matricula', 'Nom_Analista', 'Aquisitivo', 
    'Dt_Inicio', 'Dt_Fim', 'Pendente', 'Sequencia', 'Nota'
    , 'Usr_Cadastro', 'Dt_Cadastro',  'actions'];
  editingId: number | null = null;
  analistas: string[] = []; // lista para dropdown


  constructor(private fb: FormBuilder, private service: FeriasService) {
    this.form = this.fb.group({
      Matricula: [null, Validators.required],
      Nom_Analista: [{ value: '', disabled: true }, Validators.required],
      Aquisitivo: [null, Validators.required],
      Dt_Inicio: ['', Validators.required],
      Dt_Fim: ['', Validators.required],
      Pendente: [false],
      Sequencia: [null, Validators.required],
      Nota: ['', Validators.required]
    });

    this.filtroForm = this.fb.group({
      Nom_Analista: [''],
      Dt_Inicio: [''],
      Pendente: ['']
    });
  }

  ngOnInit() {
    this.carregar();
    this.carregarAnalistasDropdown(); // novo
  
    this.form.get('Matricula')?.valueChanges.subscribe(matricula => {
      if (!matricula || this.editingId) return;
  
      // limpa estado anterior
      this.form.get('Nom_Analista')?.setValue('');
      this.form.get('Matricula')?.setErrors(null);
  
      this.service.getAnalistaPorMatricula(matricula).subscribe({
        next: (resp) => {
          this.form.patchValue({
            Nom_Analista: resp.Nom_Analista
          });
  
          // remove erro caso tenha sido corrigido
          this.form.get('Matricula')?.setErrors(null);
        },
        error: () => {
          // ❌ matrícula inválida
          this.form.patchValue({
            Nom_Analista: ''
          });
  
          // 🔴 ERRO MANUAL no campo matrícula
          this.form.get('Matricula')?.setErrors({ analistaInexistente: true });
        }
      });
    });

      // Captura usuário logado
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      this.usuarioLogado = user.username;
    } catch (e) {
      console.error('Erro ao ler usuário do localStorage', e);
    }
  }
  }
  
  // Novo método para carregar dropdown
carregarAnalistasDropdown() {
  this.service.listarAnalistas().subscribe(nomes => {
    this.analistas = nomes;
  });
}

  // Carrega todos inicialmente
  carregar() {
    this.service.listar().subscribe(dados => {
      this.lista = dados.map(f => ({
        ...f,
        Dt_Inicio: f.Dt_Inicio?.slice(0,10),
        Dt_Fim: f.Dt_Fim?.slice(0,10),
        Dt_Cadastro: f.Dt_Cadastro?.slice(0,10)
      }));
    });
  }

  onSubmit() {
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValues = this.form.getRawValue(); // <- getRawValue inclui campos disabled

    const ferias: Ferias = {
      ...formValues,
      Usr_Cadastro: this.usuarioLogado,
      Dt_Cadastro: new Date().toISOString().slice(0,10) // YYYY-MM-DD
    };


    if (this.editingId) {
      this.service.atualizar(this.editingId, ferias).subscribe(() => {
        this.carregar();
        this.cancelarEdicao();
      });
    } else {
      this.service.criar(ferias).subscribe(() => {
        this.form.reset();
        this.form.get('Matricula')?.enable();
        this.carregar();
      });
    }
  }

  editar(f: Ferias) {
    this.editingId = f.Id!;
    this.form.patchValue(f);
  
    // 🔒 trava campos
    this.form.get('Matricula')?.disable();
    this.form.get('Nom_Analista')?.disable();
  }

  cancelarEdicao() {
    this.editingId = null;
    this.form.reset();
  
    // 🔓 reabilita para novo cadastro
    this.form.get('Matricula')?.enable();
  }

  deletar(id: number) {
    this.service.deletar(id).subscribe(() => this.carregar());
  }

  buscar() {
    const filtro = this.filtroForm.value;
    // Se todos os filtros vazios, busca default (toda a tabela)
    if (!filtro.Nom_Analista && !filtro.Dt_Inicio && filtro.Pendente === '') {
      this.carregar();
      return;
    }

    this.service.buscar(filtro).subscribe(dados => {
      this.lista = dados.map(f => ({
        ...f,
        Dt_Inicio: f.Dt_Inicio?.slice(0,10),
        Dt_Fim: f.Dt_Fim?.slice(0,10),
        Dt_Cadastro: f.Dt_Cadastro?.slice(0,10)
      }));
    });
  }
  limparCampos() {
    this.filtroForm.reset({
      Nom_Analista: '',
      Dt_Inicio: '',
      Pendente: ''
    });
    this.buscar(); // opcional: recarregar a lista completa após limpar
  }

  limparFormulario() {
    this.form.reset();
  
    // garante estado de cadastro
    this.editingId = null;
  
    // reabilita matrícula (caso tenha vindo de edição)
    this.form.get('Matricula')?.enable();
  }
  
}
