import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { KTService } from './kt.service';
import { KT } from './kt.model';

@Component({
  selector: 'app-kt',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  templateUrl: './kt.component.html',
  styleUrls: ['./kt.component.css']
})
export class KTComponent implements OnInit {

  @ViewChild('drawer') drawer!: MatSidenav;

  lista: KT[] = [];
  displayedColumns = ['titulo','area_destino', 'data_realizacao', 'status_kt'];
  statusSelecionado = 'AGENDADO';
  ktSelecionado: KT | null = null;
  editando = false;
  drawerOpen = false;

  form: FormGroup;

  constructor(private ktService: KTService, private fb: FormBuilder) {
    this.form = this.fb.group({
      titulo: [''],
      descricao: [''],
      participantes: [''],
      responsavel_kt: [''],
      area_origem: [''],
      area_destino: [''],
      data_envio: [''],
      data_realizacao: [''],
      aceito: ['N'],
      data_aceite: [''],
      observacao_aceite: [''],
      data_inicio_vigencia: [''],
      status_kt: ['AGENDADO'],
      link_material: [''],
      link_gravacao: [''],
    });
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.ktService.listarPorStatus(this.statusSelecionado)
      .subscribe(dados => this.lista = dados);
  }

  abrirDrawer(cod_kt: number) {
    this.ktService.getDetalhe(cod_kt).subscribe(d => {
      this.ktSelecionado = d;
      this.form.patchValue(d);
      this.editando = false;
      this.drawerOpen = true;
      this.drawer.open();
    });
  }

cancelarEdicao() {
  // Se estiver editando um KT existente, reverte o form
  if (this.editando && this.ktSelecionado) {
    this.editando = false;
    this.form.patchValue(this.ktSelecionado);
  } else {
    // Se estiver adicionando um novo KT ou não há selecionado, fecha o drawer
    this.fecharDrawer();
  }
}

  iniciarEdicao() {
    this.editando = true;
    if (this.ktSelecionado) this.form.patchValue(this.ktSelecionado);
  }

salvarEdicao() {
  const ktData = this.form.value;

  if (this.ktSelecionado && this.ktSelecionado.cod_kt) {
    // Atualizar
    this.ktService.atualizar(this.ktSelecionado.cod_kt, ktData).subscribe(
      res => {
        console.log('KT atualizado:', res);
        this.ktSelecionado = { ...this.ktSelecionado, ...ktData };
        this.editando = false;
        this.carregar();
      },
      err => console.error(err)
    );
  } else {
    // Criar novo
    this.ktService.criar(ktData).subscribe(
      res => {
        console.log('KT criado:', res);
        this.editando = false;
        this.fecharDrawer();
        this.carregar();
      },
      err => console.error(err)
    );
  }
  
      this.fecharDrawer();
      this.carregar(); // Recarrega a lista após salvar
}


  fecharDrawer() {
    this.drawer.close();
    this.ktSelecionado = null;
    this.editando = false;
  }

  adicionarKT() {
  this.ktSelecionado = null; // ou cria objeto vazio com os campos necessários
  this.form.reset({
    titulo: '',
    descricao: '',
    participantes: '',
    responsavel_kt: '',
    area_origem: '',
    area_destino: '',
    data_envio: '',
    data_realizacao: '',
    aceito: 'N',
    data_aceite: '',
    observacao_aceite: '',
    data_inicio_vigencia: '',
    status_kt: 'AGENDADO',
    link_material: '',
    link_gravacao: ''
  });
  this.editando = true;
  this.drawerOpen = true;
  this.drawer.open();
}

confirmarExclusao() {
  const confirma = confirm('Tem certeza que deseja excluir este KT? Esta ação não pode ser desfeita.');
  if (confirma && this.ktSelecionado?.cod_kt) {
    this.excluirKT(this.ktSelecionado.cod_kt);
  }
}

excluirKT(cod_kt: number) {
  this.ktService.deletar(cod_kt).subscribe(
    () => {
      console.log('KT excluído com sucesso');
      this.fecharDrawer();
      this.carregar(); // Recarrega a lista após exclusão
    },
    (err) => console.error('Erro ao excluir KT', err)
  );
}

}
