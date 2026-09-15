import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SubSubAgrupamentoService } from './sub_subagrupamento.service';
import { IncidenteService } from '../incidente/incidente.service';
import { SubSubAgrupamento } from './sub_subagrupamento.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sub-subagrupamento',
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
  templateUrl: './sub_subagrupamento.component.html',
  styleUrls: ['./sub_subagrupamento.component.css']
})
export class SubSubAgrupamentoComponent implements OnInit {

  form: FormGroup;
  filtroForm: FormGroup;
  lista: SubSubAgrupamento[] = [];
  editingId: number | null = null;

  displayedColumns = [ 
    'nome_sistema',       // <- novo
    'nome_modulo',        // <- novo
    'nome_agrupamento',   // <- novo
    'nome_subagrupamento',// <- novo
    'cod_subsubagrupamento',
    'nom_subsubagrupamento'
  ];
  displayedColumnsWithActions = [...this.displayedColumns, 'actions'];

// Arrays para dropdowns
sistemas: any[] = [];
modulos: any[] = [];
agrupamentos: any[] = [];
subAgrupamentos: any[] = [];

  // Dropdowns filtro
  filtroSistemas: {Id_aplicacao:number, nom_aplicacao:string}[] = [];
  filtroModulos: {cod_modulo:string, nom_modulo:string}[] = [];
  filtroAgrupamentos: {cod_agrupamento:string, nom_agrupamento:string}[] = [];
  filtroSubAgrupamentos: {cod_subagrupamento:string, nom_subagrupamento:string}[] = [];

  constructor(
    private fb: FormBuilder,
    private service: SubSubAgrupamentoService,
    private service2: IncidenteService
  ) {

    // Form de cadastro
    this.form = this.fb.group({
      cod_sistema: [null, Validators.required],
      Cod_Modulo: [null, Validators.required],
      cod_agrupamento: [null, Validators.required],
      cod_subagrupamento: [null, Validators.required],
      cod_subsubagrupamento: [{ value: null, disabled: true }, Validators.required],
      nom_subsubagrupamento: ['', Validators.required]
    });

    // Form de filtro
    this.filtroForm = this.fb.group({
      cod_sistema: [null, Validators.required],
      Cod_Modulo: [null, Validators.required],
      cod_agrupamento: [null, Validators.required],
      cod_subagrupamento: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.carregarSistemas();
    this.carregarSistemasFiltro();
  }

  private resetarCodSubSub() {
    this.form.get('cod_subsubagrupamento')?.reset();
    this.form.get('cod_subsubagrupamento')?.disable();
  }

  private buscarProximoCodSubSub() {
  const f = this.form.value;

  if (
    f.cod_sistema &&
    f.Cod_Modulo &&
    f.cod_agrupamento &&
    f.cod_subagrupamento &&
    !this.editingId
  ) {
    this.service.getNextCodSubSub(
      f.cod_sistema,
      f.Cod_Modulo,
      f.cod_agrupamento,
      f.cod_subagrupamento
    ).subscribe(res => {
      this.form.get('cod_subsubagrupamento')?.setValue(res.nextcod_subsubagrupamento);
      this.form.get('cod_subsubagrupamento')?.disable();
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
  this.form.patchValue({ Cod_Modulo: null, cod_agrupamento: null, cod_subagrupamento: null });
  this.modulos = [];
  this.agrupamentos = [];
  this.subAgrupamentos = [];

  this.resetarCodSubSub();
  this.service2.getModulos(sistemaId).subscribe(res => this.modulos = res);
}

// Ao selecionar Módulo
onModuloChange(codModulo: number) {
  const sistemaId = this.form.get('cod_sistema')?.value;
  this.form.patchValue({ cod_agrupamento: null, cod_subagrupamento: null });
  this.agrupamentos = [];
  this.subAgrupamentos = [];

  this.resetarCodSubSub();
  if (sistemaId != null && codModulo != null) {
    this.service2.getAgrupamentos(sistemaId.toString(), codModulo.toString()).subscribe(res => this.agrupamentos = res);
  }
}

onAgrupamentoChange(codAgrupamento: number) {
  const sistemaId = this.form.get('cod_sistema')?.value;
  const codModulo = this.form.get('Cod_Modulo')?.value;
  this.form.patchValue({ cod_subagrupamento: null });
  this.subAgrupamentos = [];

  this.resetarCodSubSub();
  if (sistemaId != null && codModulo != null && codAgrupamento != null) {
    this.service2.getSubAgrupamentos(sistemaId.toString(), codModulo.toString(), codAgrupamento.toString())
        .subscribe(res => this.subAgrupamentos = res);
  }
}
onSubAgrupamentoChange(codSubAgrupamento: number) {
  this.resetarCodSubSub();
  this.buscarProximoCodSubSub();
}

  // ---------------------------
  //  DROPDOWNS FILTRO
  // ---------------------------
  carregarSistemasFiltro() {
    this.service2.getSistemas().subscribe(dados => this.filtroSistemas = dados);
  }

  onFiltroSistemaChange(sistemaId: number) {
    this.filtroModulos = [];
    this.filtroAgrupamentos = [];
    this.filtroSubAgrupamentos = [];
    this.filtroForm.patchValue({ Cod_Modulo: null, cod_agrupamento: null, cod_subagrupamento: null });

    if (!sistemaId) return;
    this.service2.getModulos(sistemaId).subscribe(dados => this.filtroModulos = dados);
     
  }

  onFiltroModuloChange(codModulo: number) {
    const sistemaId = this.filtroForm.get('cod_sistema')?.value;
    this.filtroAgrupamentos = [];
    this.filtroSubAgrupamentos = [];
    this.filtroForm.patchValue({ cod_agrupamento: null, cod_subagrupamento: null });

    if (!sistemaId || !codModulo) return;
    this.service2.getAgrupamentos(sistemaId.toString(),  codModulo.toString() ).subscribe(dados => this.filtroAgrupamentos = dados);
  }

  onFiltroAgrupamentoChange(codAgrupamento: number) {
    const sistemaId = this.filtroForm.get('cod_sistema')?.value;
    const codModulo = this.filtroForm.get('Cod_Modulo')?.value;
    this.filtroSubAgrupamentos = [];
    this.filtroForm.patchValue({ cod_subagrupamento: null });

    if (!sistemaId || !codModulo || !codAgrupamento) return;
    this.service2.getSubAgrupamentos(sistemaId.toString(), codModulo.toString(), codAgrupamento.toString())
      .subscribe(dados => this.filtroSubAgrupamentos = dados);
  }

  // ---------------------------
  //  BUSCA / LIMPAR
  // ---------------------------
  buscar() {
    if (this.filtroForm.invalid) return;

    const f = this.filtroForm.value;
    this.service.buscar(
      Number(f.cod_sistema),
      Number(f.Cod_Modulo),
        Number(f.cod_agrupamento),
          Number(f.cod_subagrupamento)
    ).subscribe(dados => this.lista = dados);
  }

  limparFiltro() {
    this.filtroForm.reset();
    this.lista = [];
    this.filtroModulos = [];
    this.filtroAgrupamentos = [];
    this.filtroSubAgrupamentos = [];
  }

  // ---------------------------
  //  CRUD
  // ---------------------------
  onSubmit() {
    const item: SubSubAgrupamento = this.form.getRawValue();

    if (this.editingId) {
      this.service.atualizar(this.editingId, item).subscribe(() => {
        this.editingId = null;
        this.resetarFormularioCompleto();
        this.buscar()
      });
    } else {
      this.service.criar(item).subscribe(() => {
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
    this.agrupamentos = [];
    this.subAgrupamentos = [];
  
    // garante estados corretos
    this.form.get('cod_sistema')?.enable();
    this.form.get('Cod_Modulo')?.enable();
    this.form.get('cod_agrupamento')?.enable();
    this.form.get('cod_subagrupamento')?.enable();
  
    // código automático
    this.resetarCodSubSub();
  }

  editar(item: SubSubAgrupamento) {
    this.editingId = item.Id ?? null;
  
    // Preenche o form
    this.form.patchValue({
      cod_sistema: item.cod_sistema,
      Cod_Modulo: item.Cod_Modulo,
      cod_agrupamento: item.cod_agrupamento,
      cod_subagrupamento: item.cod_subagrupamento,
      cod_subsubagrupamento: item.cod_subsubagrupamento,
      nom_subsubagrupamento: item.nom_subsubagrupamento
    });
    this.form.get('cod_sistema')?.disable();
    this.form.get('Cod_Modulo')?.disable();
    this.form.get('cod_agrupamento')?.disable();
    this.form.get('cod_subagrupamento')?.disable();
    this.form.get('cod_subsubagrupamento')?.disable(); 
  
    // 1️⃣ Carrega módulos
    this.service2.getModulos(item.cod_sistema).subscribe(mods => {
      this.modulos = mods;
  
      // 2️⃣ Carrega agrupamentos do módulo selecionado
      this.service2.getAgrupamentos(item.cod_sistema , item.Cod_Modulo.toString())
        .subscribe(agrups => {
          this.agrupamentos = agrups;
  
          // 3️⃣ Carrega sub-agrupamentos do agrupamento selecionado
          this.service2.getSubAgrupamentos(
            item.cod_sistema ,
            item.Cod_Modulo.toString(),
            item.cod_agrupamento.toString()
          ).subscribe(subs => {
            this.subAgrupamentos = subs;
          });
        });
    });
  }
   
  cancelarEdicao() {
    this.resetarFormularioCompleto();
    this.editingId = null;
  }

  deletar(id: number) {
    this.service.deletar(id).subscribe(() => {
      this.lista = this.lista.filter(e => e.Id !== id);
    });
  }

}
