import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ProblemReportService } from './problemreport.service';
import { ProblemReport } from './problemreport.model';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatSort, MatSortModule  } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-problem-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSortModule
  ],
  templateUrl: './problemreport.component.html',
  styleUrls: ['./problemreport.component.css']
})
export class ProblemReportComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<ProblemReport>();

  form: FormGroup;
  lista: ProblemReport[] = [];
  displayedColumns = ['Id', 
  'Nom_Problem',
  'Desc_Tip_Problem', 
  'Desc_Status', 
  'Dt_Abertura', 
  'Dt_Encerramento',
  'cont_inc_problem'  // nova coluna adicionada
   ];
  tiposProblem = [
    { id: 1, desc1: 'Sev1' },
    { id: 2, desc1: 'Recorrente' }
  ];
  statusProblem = [
    { id: 1, desc2: 'Aberto' },
    { id: 2, desc2: 'Em andamento' },
    { id: 3, desc2: 'Solução Temporária' },
    { id: 4, desc2: 'Concluído' },
    { id: 5, desc2: 'Cancelado' }
  ];
  constructor(
    private fb: FormBuilder,
    private service: ProblemReportService
  ) {
    this.form = this.fb.group({
      dataInicio: [''],
      dataFim: [''],
      periodo: [''],
      tipProblem: [''],
      status: ['']
    });
  }

  ngOnInit() {
    // Inicializa o formulário
    this.form = this.fb.group({
      tipoData: ['todos'],      // Todos, Abertura, Encerramento
      periodo: [''],            // Ano atual, 3 meses, mês atual, personalizado
      dataInicio: [''],
      dataFim: [''],
      tipProblem: [''],
      status: ['']
    });
  
    this.controlarFiltrosDatas();
    this.dataSource.filterPredicate = (data: ProblemReport, filter: string) => {
      return data.Nom_Problem
        ?.toLowerCase()
        .includes(filter);
    };
  }

buscar() {
  this.service.listar(this.form.value).subscribe(dados => {
    const listaFormatada = dados.map(item => ({
      ...item,
      Dt_Abertura: item.Dt_Abertura ? new Date(item.Dt_Abertura) : null,
      Dt_Encerramento: item.Dt_Encerramento ? new Date(item.Dt_Encerramento) : null,
      cont_inc_problem: item.cont_inc_problem || 0
    }));

    this.dataSource.data = listaFormatada;
    this.dataSource.sort = this.sort; // conecta o MatSort
  });
}

aplicarFiltro(event: Event) {
  const valor = (event.target as HTMLInputElement).value;
  this.dataSource.filter = valor.trim().toLowerCase();
}

// Controle dinâmico dos filtros de datas
controlarFiltrosDatas() {
  // Se escolher tipoData 'todos', limpa período e datas
  this.form.get('tipoData')?.valueChanges.subscribe(tipo => {
    if (tipo === 'todos') {
      this.form.get('periodo')?.disable({ emitEvent: false });
      this.form.get('dataInicio')?.disable({ emitEvent: false });
      this.form.get('dataFim')?.disable({ emitEvent: false });
    } else {
      this.form.get('periodo')?.enable({ emitEvent: false });
  
      // Se período já estiver personalizado, habilita datas
      if (this.form.get('periodo')?.value === 'personalizado') {
        this.form.get('dataInicio')?.enable({ emitEvent: false });
        this.form.get('dataFim')?.enable({ emitEvent: false });
      }
    }
  });
  
  this.form.get('periodo')?.valueChanges.subscribe(periodo => {
    const tipo = this.form.get('tipoData')?.value;
    if (tipo !== 'todos' && periodo === 'personalizado') {
      this.form.get('dataInicio')?.enable({ emitEvent: false });
      this.form.get('dataFim')?.enable({ emitEvent: false });
    } else {
      this.form.get('dataInicio')?.disable({ emitEvent: false });
      this.form.get('dataFim')?.disable({ emitEvent: false });
    }
  });
  
}
   

limpar() {
  // Reset com valores iniciais
  this.form.reset({
    tipoData: 'todos',  // volta ao estado original
    periodo: '',         
    dataInicio: '',
    dataFim: '',
    tipProblem: '',
    status: ''
  });

  // Limpa a tabela
  this.dataSource.data = [];
  this.dataSource.filter = ''; // limpa busca dinâmica
}

podeBuscar(): boolean {
  const tipoData = this.form.get('tipoData')?.value;
  const periodo = this.form.get('periodo')?.value;
  const dataInicio = this.form.get('dataInicio')?.value;
  const dataFim = this.form.get('dataFim')?.value;

  // Caso TODOS → sempre pode buscar
  if (tipoData === 'todos') {
    return true;
  }

  // Abertura ou Encerramento sem período → NÃO pode
  if (!periodo) {
    return false;
  }

  // Período personalizado exige DE e ATE
  if (periodo === 'personalizado') {
    if (!dataInicio || !dataFim) {
      return false;
    }
  }

  return true;
}

exportarExcel() {

  const dados = this.dataSource.filteredData.length
    ? this.dataSource.filteredData
    : this.dataSource.data;

  if (!dados || dados.length === 0) {
    alert('Nenhum registro para exportar!');
    return;
  }

  const dadosParaExcel = dados.map(item => ({
    ID: item.Id,
    Problem: item.Nom_Problem,
    Tipo: item.Desc_Tip_Problem,
    Status: item.Desc_Status,
    'Data Abertura': item.Dt_Abertura ? item.Dt_Abertura.toLocaleString() : '',
    'Data Fechamento': item.Dt_Encerramento ? item.Dt_Encerramento.toLocaleString() : '',
    'Qtd Incidentes Associados': item.cont_inc_problem,
    Descrição: item.Descricao || ''
  }));

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dadosParaExcel);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Problems');

  const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(
    new Blob([wbout], { type: 'application/octet-stream' }),
    'Relatorio_Problems.xlsx'
  );
}

  
  
}
