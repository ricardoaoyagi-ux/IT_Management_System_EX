import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { JustificativaReportService } from './justificativareport.service';
import { JustificativaPendenciaDTO } from './pendencias.dto';
import { JustificativaMotivoDTO } from './motivos.dto';
import { JustificativaAnalistaDTO } from './analistas.dto';

@Component({
  selector: 'app-justificativa-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSortModule,
    MatTabsModule
  ],
  templateUrl: './justificativareport.component.html',
  styleUrls: ['./justificativareport.component.css']
})
export class JustificativaReportComponent implements OnInit {

  @ViewChild(MatSort) sort!: MatSort;

  form!: FormGroup;
  abaSelecionada = 0;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];

  // Colunas por visão
  colunasPendentes = ['analista', 'pendentes', 'feitas'];
  colunasMotivos = ['mes', 'motivo', 'quantidade'];
  colunasAnalistas = ['analista', 'total'];

  

  constructor(  private fb: FormBuilder,
    private service: JustificativaReportService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
        tipo: ['TODOS'],        // 👈 NOVO
      periodo: ['3m'],
      dataInicio: [''],
      dataFim: ['']
    });


    this.onTabChange(0);
    this.form.get('tipo')?.valueChanges.subscribe(() => {
        this.dataSource.data = [];
      });
  }

  onTabChange(index: number) {
    this.abaSelecionada = index;

    if (index === 0) {
      this.displayedColumns = this.colunasPendentes;
    }

    if (index === 1) {
      this.displayedColumns = this.colunasMotivos;
    }

    if (index === 2) {
      this.displayedColumns = this.colunasAnalistas;
    }

    this.dataSource.data = [];
  }

  buscar() {
    const filtro = this.form.value;
  
    if (this.abaSelecionada === 0) {
      this.service.listarPendencias(filtro)
        .subscribe((dados: JustificativaPendenciaDTO[]) => {
          this.dataSource.data = dados;
          this.dataSource.sort = this.sort;
        });
    }
  
    if (this.abaSelecionada === 1) {
      this.service.listarMotivos(filtro)
        .subscribe((dados: JustificativaMotivoDTO[]) => {
          this.dataSource.data = dados;
          this.dataSource.sort = this.sort;
        });
    }
  
    if (this.abaSelecionada === 2) {
      this.service.listarAnalistas(filtro)
        .subscribe((dados: JustificativaAnalistaDTO[]) => {
          this.dataSource.data = dados;
          this.dataSource.sort = this.sort;
        });
    }
  }
  

  limpar() {
    this.form.reset({
      periodo: '3m',
      dataInicio: '',
      dataFim: ''
    });
    this.dataSource.data = [];
  }

  exportarExcel() {
    if (!this.dataSource.data.length) {
      alert('Nenhum registro para exportar!');
      return;
    }
  
    const { tipo, periodo, dataInicio, dataFim } = this.form.value;
  
    const resumo = [
      { Campo: 'Relatório', Valor: this.getNomeAba() },
      { Campo: 'Métrica', Valor: tipo },
      {
        Campo: 'Período',
        Valor:
          periodo === 'personalizado'
            ? `De ${dataInicio} até ${dataFim}`
            : periodo === 'mes'
            ? 'Mês Atual'
            : 'Últimos 3 Meses'
      },
      { Campo: 'Gerado em', Valor: new Date().toLocaleString('pt-BR') }
    ];
  
    // Planilha de resumo
    const wsResumo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(resumo, {
      skipHeader: false
    });
  
    // Linha em branco
    XLSX.utils.sheet_add_aoa(wsResumo, [[]], { origin: -1 });
  
    // Dados principais (começam após o resumo)
    XLSX.utils.sheet_add_json(wsResumo, this.dataSource.data, {
      origin: -1
    });
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
    const nomeAba = this.getNomeAba();
    XLSX.utils.book_append_sheet(wb, wsResumo, nomeAba);
  
    const wbout: ArrayBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });
  
    const nomeArquivo =
      `rel_${nomeAba}_${tipo.toLowerCase()}_${this.getDescricaoPeriodo()}.xlsx`;
  
    saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      nomeArquivo
    );
  }
  

  private getNomeAba(): string {
    if (this.abaSelecionada === 0) return 'pendencias';
    if (this.abaSelecionada === 1) return 'motivos';
    if (this.abaSelecionada === 2) return 'analistas';
    return 'relatorio';
  }
  
  private formatarData(data: string): string {
    if (!data) return '';
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}${mes}${ano}`;
  }
  
  private getDescricaoPeriodo(): string {
    const { periodo, dataInicio, dataFim } = this.form.value;
  
    if (periodo === 'mes') return 'mes_atual';
    if (periodo === '3m') return 'ultimos3m';
  
    if (periodo === 'personalizado') {
      return `${this.formatarData(dataInicio)}_${this.formatarData(dataFim)}`;
    }
  
    return 'periodo';
  }
  
}
