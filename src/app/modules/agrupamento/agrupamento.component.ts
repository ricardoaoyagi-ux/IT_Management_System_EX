import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AgrupamentoService } from './agrupamento.service';
import { Agrupamento } from './agrupamento.model';
import { IncidenteService } from '../incidente/incidente.service';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-agrupamento',
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
  templateUrl: './agrupamento.component.html',
  styleUrls: ['./agrupamento.component.css']
})
export class AgrupamentoComponent {

  form: FormGroup;
  filtroForm: FormGroup;

  lista: Agrupamento[] = [];

  displayedColumns = [
    'nome_sistema',       // <- novo
    'nome_modulo',        // <- novo
    'Cod_agrupamento',
    'nom_agrupamento'
  ];

  displayedColumnsWithActions = [...this.displayedColumns, 'actions'];

  editingId: number | null = null;
  // Arrays para dropdowns
  sistemas: any[] = [];
  modulos: any[] = [];

  // Dropdowns filtro
  filtroSistemas: {Id_aplicacao:number, nom_aplicacao:string}[] = [];
  filtroModulos: {cod_modulo:string, nom_modulo:string}[] = [];

  constructor(
    private fb: FormBuilder,
    private agrupamentoService: AgrupamentoService,
            private service2: IncidenteService
  ) {

    // Quadro 1 – Cadastro
    this.form = this.fb.group({
      Cod_Sistema: [null, Validators.required],
      Cod_Modulo: [null, Validators.required],
      Cod_agrupamento: [{ value: null, disabled: true }, Validators.required],
      nom_agrupamento: ['', Validators.required]
    });

    // Quadro 2 – Busca
    this.filtroForm = this.fb.group({
      Cod_Sistema: [null, Validators.required],
      Cod_Modulo: [null, Validators.required]
    });
  }
  ngOnInit() {
    this.carregarSistemas();
    this.carregarSistemasFiltro();
  }

  private resetarCod() {
    this.form.get('Cod_agrupamento')?.reset();
    this.form.get('Cod_agrupamento')?.disable();
  }

  private buscarProximoCod() {
  const f = this.form.value;

  if (
    f.Cod_Sistema &&
    f.Cod_Modulo &&
    !this.editingId
  ) {
    this.agrupamentoService.getNextCod(
      f.Cod_Sistema,
      f.Cod_Modulo
    ).subscribe(res => {
      this.form.get('Cod_agrupamento')?.setValue(res.nextcod_agrupamento);
      this.form.get('Cod_agrupamento')?.disable();
    });
  }
}
  // ---------------------------
  //  DROPDOWNS CADASTRO
  // ---------------------------
  carregarSistemas() {
    this.service2.getSistemas().subscribe(dados => this.sistemas = dados);
  }

  // Ao selecionar Sistema
  onSistemaChange(sistemaId: number) {
    this.form.patchValue({ Cod_Modulo: null });
    this.modulos = []; 
    this.resetarCod();
  
    this.service2.getModulos(sistemaId).subscribe(res => this.modulos = res);
  }

  // Ao selecionar Módulo
  onModuloChange(codModulo: number) {
    this.resetarCod();
    this.buscarProximoCod(); 
  } 
  // ---------------------------
  //  DROPDOWNS FILTRO
  // ---------------------------
  carregarSistemasFiltro() {
    this.service2.getSistemas().subscribe(dados => this.filtroSistemas = dados);
  }

  onFiltroSistemaChange(sistemaId: number) {
    this.filtroModulos = [];
    this.filtroForm.patchValue({ Cod_Modulo: null });

    if (!sistemaId) return;
    this.service2.getModulos(sistemaId).subscribe(dados => this.filtroModulos = dados);
     
  }

  onFiltroModuloChange(codModulo: number) {
    const sistemaId = this.filtroForm.get('Cod_Sistema')?.value;
    this.filtroForm.patchValue({ Cod_agrupamento: null  });
  }

  // 🔍 BUSCAR
  buscar() {
    if (this.filtroForm.invalid) return;

    const filtro = this.filtroForm.value;

    this.agrupamentoService
      .buscar(
        Number(filtro.Cod_Sistema), 
        Number(filtro.Cod_Modulo))
      .subscribe(dados => {
        this.lista = dados;
      });
  }

  
  limparFiltro() {
    this.filtroForm.reset();
    this.lista = [];
    this.filtroModulos = [];
  }
  
  // 💾 CREATE / UPDATE
  onSubmit() {
    const agrupamento: Agrupamento = this.form.getRawValue();
  
    if (this.editingId) {
      this.agrupamentoService
        .atualizar(this.editingId, agrupamento)
        .subscribe(() => {
          this.resetarFormularioCompleto();
          this.editingId = null;
          this.buscar()
        });
    } else {
      this.agrupamentoService
        .criar(agrupamento)
        .subscribe(() => {
          this.resetarFormularioCompleto();
          this.buscar()
        });
    }
  }

  private resetarFormularioCompleto() {
    // limpa form
    this.form.reset();
  
    // limpa dropdowns encadeados
    this.modulos = [];
  
    // garante estados corretos
    this.form.get('Cod_Sistema')?.enable();
    this.form.get('Cod_Modulo')?.enable();
  
    // código automático
    this.resetarCod();
  }

  editar(item: Agrupamento) {
    this.editingId = item.Id ?? null;
  
    // Preenche o form
    this.form.patchValue({
      Cod_Sistema: Number(item.Cod_Sistema),
      Cod_Modulo: Number(item.Cod_Modulo),
      Cod_agrupamento: Number(item.Cod_agrupamento),
      nom_agrupamento: item.nom_agrupamento
    });
    this.form.get('Cod_Sistema')?.disable();
    this.form.get('Cod_Modulo')?.disable();
    this.form.get('Cod_agrupamento')?.disable();
  
    // 1️⃣ Carrega módulos
    this.service2.getModulos(item.Cod_Sistema).subscribe(mods => {
      this.modulos = mods; 
    });
  }

  cancelarEdicao() {
    this.resetarFormularioCompleto();
    this.editingId = null;
  }

  deletar(id: number) {
    this.agrupamentoService.deletar(id).subscribe(() => {
      this.buscar();
    });
  }

}
