import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlantaoService } from './plantao.service';
import { Plantao } from './plantao.model';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core'; 
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
const moment = _moment;

export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    }
  };

@Component({
  selector: 'app-plantao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule, // <--- substituir MatNativeDateModule
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule // <--- ESSENCIAL!
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],

  templateUrl: './plantao.component.html',
  styleUrls: ['./plantao.component.css']
})
export class PlantaoComponent implements OnInit {

  form: FormGroup;
  lista: Plantao[] = [];
  displayedColumns = [
    'Id', 'data_ini', 'data_fim', 'fechamento', 
    'nivel1_sistemaA', 'nivel1_sistemaD', 'nivel1_codeadmin', 
    'nivel2', 'obs', 'actions'
  ];
  editingId: number | null = null;
  usuarioLogado: string = '';


  constructor(private fb: FormBuilder, private plantaoService: PlantaoService) {
    this.form = this.fb.group({
        periodo: this.fb.group({
          start: [null, Validators.required], // data_ini
          end: [null, Validators.required]    // data_fim
        }),
        fechamento: [false],
        nivel1_sistemaA: ['' ],
        nivel1_sistemaD: ['' ],
        nivel1_codeadmin: ['' ],
        nivel2: ['' ],
        obs: ['', Validators.required]
      });
      
  }

  ngOnInit() {
      // Carregar usuário logado do localStorage
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
  }

  carregar() {
    this.plantaoService.listar().subscribe(dados => {
      this.lista = dados;
    });
  }

  onSubmit() {
    const plantao: Plantao = { ...this.form.value };

    // Datas do range
    plantao.data_ini = this.form.value.periodo.start
      ? this.form.value.periodo.start.toISOString().split('T')[0]
      : null;
    
    plantao.data_fim = this.form.value.periodo.end
      ? this.form.value.periodo.end.toISOString().split('T')[0]
      : null;
    
    // Restante do código
    const agora = new Date();
    plantao.data_alteracao = `${agora.getFullYear()}-${(agora.getMonth()+1)
      .toString().padStart(2,'0')}-${agora.getDate().toString().padStart(2,'0')} ${agora.getHours().toString().padStart(2,'0')}:${agora.getMinutes().toString().padStart(2,'0')}:${agora.getSeconds().toString().padStart(2,'0')}`;
    plantao.usuario_alteracao = this.usuarioLogado;
    
    if (this.editingId) {
      this.plantaoService.atualizar(this.editingId, plantao).subscribe(() => {
        this.form.reset();
        this.editingId = null;
        this.carregar();
      });
    } else {
      this.plantaoService.criar(plantao).subscribe(() => {
        this.form.reset();
        this.carregar();
      });
    }
  }    
  
  limparCampos() {
    this.form.reset();
    this.editingId = null;
  }
  
  editar(plantao: Plantao) {
    this.editingId = plantao.Id ?? null;
  
    this.form.patchValue({
      periodo: {
        start: this.parseDateOnly( plantao.data_ini),
        end: this.parseDateOnly(plantao.data_fim)
      },
      fechamento: plantao.fechamento,
      nivel1_sistemaA: plantao.nivel1_sistemaA,
      nivel1_sistemaD: plantao.nivel1_sistemaD,
      nivel1_codeadmin: plantao.nivel1_codeadmin,
      nivel2: plantao.nivel2,
      obs: plantao.obs
    });
  }
  
  
  cancelarEdicao() {
    this.editingId = null;
    this.form.reset();
  }

  deletar(id: number) {
    this.plantaoService.deletar(id).subscribe(() => {
      this.carregar();
    });
  }

private parseDateOnly(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // mês começa em 0
}

}
