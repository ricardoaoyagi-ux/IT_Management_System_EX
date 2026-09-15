import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IncidenteService } from '../incidente/incidente.service';
import { SubAgrupamentoService } from './sub_agrupamento.service';
import { SubAgrupamento } from './sub_agrupamento.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-sub-agrupamento',
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
  templateUrl: './sub-agrupamento.component.html',
  styleUrls: ['./sub-agrupamento.component.css']
})
export class SubAgrupamentoComponent {

  // Quadro 1 – Cadastro
  form: FormGroup;

  // Quadro 2 – Busca
  filtroForm: FormGroup;

  // Quadro 3 – Resultado
  lista: SubAgrupamento[] = [];

  editingId: number | null = null;

  displayedColumns = [
    'nome_sistema',       // <- novo
    'nome_modulo',        // <- novo
    'nom_agrupamento',   // <- novo
    'cod_subagrupamento',
    'nom_subagrupamento'
  ];

  displayedColumnsWithActions = [...this.displayedColumns, 'actions'];

  // Arrays para dropdowns
  sistemas: any[] = [];
  modulos: any[] = [];
  agrupamentos: any[] = [];

  // Dropdowns filtro
  filtroSistemas: {Id_aplicacao:number, nom_aplicacao:string}[] = [];
  filtroModulos: {cod_modulo:string, nom_modulo:string}[] = [];
  filtroAgrupamentos: {cod_agrupamento:string, nom_agrupamento:string}[] = [];

  constructor(
    private fb: FormBuilder,
    private service: SubAgrupamentoService,
        private service2: IncidenteService
  ) {

    this.form = this.fb.group({
      cod_sistema: [null, Validators.required],
      Cod_Modulo: [null, Validators.required],
      cod_agrupamento: [null, Validators.required],
      cod_subagrupamento: [{ value: null, disabled: true }, Validators.required],
      nom_subagrupamento: ['', Validators.required]
    });

    this.filtroForm = this.fb.group({
      cod_sistema: [null, Validators.required],
      Cod_Modulo: [null, Validators.required],
      cod_agrupamento: [null, Validators.required]
    });
  }
  
  ngOnInit() {
    this.carregarSistemas();
    this.carregarSistemasFiltro();
  }

  private resetarCodSub() {
    this.form.get('cod_subagrupamento')?.reset();
    this.form.get('cod_subagrupamento')?.disable();
  }

  private buscarProximoCodSub() {
  const f = this.form.value;

  if (
    f.cod_sistema &&
    f.Cod_Modulo &&
    f.cod_agrupamento &&
    !this.editingId
  ) {
    this.service.getNextCodSub(
      f.cod_sistema,
      f.Cod_Modulo,
      f.cod_agrupamento
    ).subscribe(res => {
      this.form.get('cod_subagrupamento')?.setValue(res.nextcod_subagrupamento);
      this.form.get('cod_subagrupamento')?.disable();
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
  this.form.patchValue({ Cod_Modulo: null, cod_agrupamento: null });
  this.modulos = [];
  this.agrupamentos = [];
  this.resetarCodSub();

  this.service2.getModulos(sistemaId).subscribe(res => this.modulos = res);
}

// Ao selecionar Módulo
onModuloChange(codModulo: number) {
  const sistemaId = this.form.get('cod_sistema')?.value;
  this.form.patchValue({ cod_agrupamento: null });
  this.agrupamentos = [];
  this.resetarCodSub();

  if (sistemaId != null && codModulo != null) {
    this.service2.getAgrupamentos(sistemaId.toString(), codModulo.toString()).subscribe(res => this.agrupamentos = res);
  }
}

onAgrupamentoChange(codAgrupamento: number) {
  this.resetarCodSub();
  this.buscarProximoCodSub();
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
    this.filtroForm.patchValue({ Cod_Modulo: null, cod_agrupamento: null  });

    if (!sistemaId) return;
    this.service2.getModulos(sistemaId).subscribe(dados => this.filtroModulos = dados);
     
  }

  onFiltroModuloChange(codModulo: number) {
    const sistemaId = this.filtroForm.get('cod_sistema')?.value;
    this.filtroAgrupamentos = [];
    this.filtroForm.patchValue({ cod_agrupamento: null  });

    if (!sistemaId || !codModulo) return;
    this.service2.getAgrupamentos(sistemaId.toString(),  codModulo.toString() ).subscribe(dados => this.filtroAgrupamentos = dados);
  }

  onFiltroAgrupamentoChange(codAgrupamento: number) {
    const sistemaId = this.filtroForm.get('cod_sistema')?.value;
    const codModulo = this.filtroForm.get('Cod_Modulo')?.value;
    this.filtroForm.patchValue({ cod_subagrupamento: null });
  }



  // 🔍 BUSCAR
  buscar() {
    if (this.filtroForm.invalid) return;

    const filtro = this.filtroForm.value;

    this.service
      .buscar(
        Number(filtro.cod_sistema),
          Number(filtro.Cod_Modulo),
            Number(filtro.cod_agrupamento)
      )
      .subscribe(dados => {
        this.lista = dados;
      });
  }

  limparFiltro() {
    this.filtroForm.reset();
    this.lista = [];
    this.filtroModulos = [];
    this.filtroAgrupamentos = [];
  }

  // 💾 CREATE / UPDATE
  onSubmit() {
    const item: SubAgrupamento =  this.form.getRawValue();
    if (this.editingId) {
      this.service.atualizar(this.editingId, item).subscribe(() => {
        this.resetarFormularioCompleto();
        this.editingId = null;
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
  
    // garante estados corretos
    this.form.get('cod_sistema')?.enable();
    this.form.get('Cod_Modulo')?.enable();
    this.form.get('cod_agrupamento')?.enable();
  
    // código automático
    this.resetarCodSub();
  }

  editar(item: SubAgrupamento) {
    this.editingId = item.Id ?? null;
  
    // Preenche o form
    this.form.patchValue({
      cod_sistema: item.cod_sistema,
      Cod_Modulo: item.Cod_Modulo,
      cod_agrupamento: item.cod_agrupamento,
      cod_subagrupamento: item.cod_subagrupamento,
      nom_subagrupamento: item.nom_subagrupamento
    });
    this.form.get('cod_sistema')?.disable();
    this.form.get('Cod_Modulo')?.disable();
    this.form.get('cod_agrupamento')?.disable();
    this.form.get('cod_subagrupamento')?.disable(); 
  
    // 1️⃣ Carrega módulos
    this.service2.getModulos(item.cod_sistema).subscribe(mods => {
      this.modulos = mods;
  
      // 2️⃣ Carrega agrupamentos do módulo selecionado
      this.service2.getAgrupamentos(item.cod_sistema , item.Cod_Modulo.toString())
        .subscribe(agrups => {
          this.agrupamentos = agrups;
        });
    });
  }

  cancelarEdicao() {
    this.resetarFormularioCompleto();
    this.editingId = null;
  }

  deletar(id: number) {
    this.service.deletar(id).subscribe(() => {
      // não faz busca automática
      this.lista = this.lista.filter(e => e.Id !== id);
    });
  }
}
