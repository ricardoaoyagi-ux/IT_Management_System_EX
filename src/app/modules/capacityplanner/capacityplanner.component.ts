  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
  import { MatTooltipModule } from '@angular/material/tooltip';
  import { MatDialog,MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

  import { MatButtonModule } from '@angular/material/button';
  import { MatSelectModule } from '@angular/material/select';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { ProjectSummaryDialogComponent } from './project-summary-dialog.component';

  import { PlannerMes } from './capacityplanner.model';
  import { AnalistaDTO } from './capacityplanner.model'; 
  import { LinhaPlanner } from './capacityplanner.model'; 
  import { TimeboxProjetoDTO } from './capacityplanner.model';
  import { FeriadoDTO } from './capacityplanner.model';
  import { FeriasDTO } from './capacityplanner.model'; 
  import { LinhaAnalista } from './capacityplanner.model';
  import { LinhaProjeto } from './capacityplanner.model'; 
  import { ParticipacaoDTO } from './capacityplanner.model'; 

  import { CapacityEngineService } from './capacityengine.service';

  import { CapacityPlannerService } from './capacityplanner.service'; 
  import { forkJoin } from 'rxjs';


  interface GrupoPeriodo {
    label: string;
    dias: Date[];
  }

  @Component({
    selector: 'app-capacity-planner',
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatSelectModule,
      MatFormFieldModule,
      MatDialogModule,
      MatTooltipModule,   // 👈 ADICIONE AQUI
      MatCheckboxModule
    ],
    templateUrl: './capacityplanner.component.html',
    styleUrls: ['./capacityplanner.component.css']
  })
  export class CapacityPlannerComponent implements OnInit {

    filtroForm: FormGroup;

    readonly MES_MINIMO = new Date(2026, 0, 1);

    mesBase: Date = (() => {
      const hoje = new Date();
      return hoje < this.MES_MINIMO ? this.MES_MINIMO : hoje;
    })();


    linhasProjetos: LinhaProjeto[] = []; // <- declarar aqui     

    mesesVisiveis: PlannerMes[] = [];
  analistas: LinhaPlanner[] = [];
    private analistasDTO: AnalistaDTO[] = [];
  
  //private membrosProjetoIds = new Set<number>();
  private feriadosPorData: Map<number, FeriadoDTO> = new Map();
  private feriasPorAnalista: Map<number, FeriasDTO[]> = new Map();
  //private projetosPorAnalista = new Map<number, ProjetoMembroDTO[]>();
  private projetosPorId = new Map<number, TimeboxProjetoDTO>(); 
    private projetosDTO: TimeboxProjetoDTO[] = [];
  //  private membrosDTO: ProjetoMembroDTO[] = [];
    private feriadosDTO: FeriadoDTO[] = [];
    private feriasDTO: FeriasDTO[] = [];
    private participacoesDTO: ParticipacaoDTO[] = [];

    // Mapa crítico para regras de férias/licença.
  // Deve ser populado no carregamento dos dados, nunca em código de UI.
  private analistaIdParaMatricula = new Map<number, number>(); 
  

    linhas: LinhaPlanner[] = [];

get linhasFiltradas() {
  const grupo = this.filtroForm.value.grupo;
  const visao = this.filtroForm.value.visao;

  let linhas = this.linhas;

  // 🔹 Filtro por grupo (SUSTAIN / PROJETOS)
  if (grupo !== 'TODOS') {
    linhas = linhas.filter(l => l.grupo === grupo);
  }

  // 🔹 Filtro por status (apenas visão PROJETO)
if (visao === 'PROJETO') {
  const statusFiltro = this.filtroForm.value.statusProjetos;

  linhas = linhas.filter(l => {
    if (l.tipo !== 'PROJETO') return true;
    if (!l.status) return false; // 🔥 proteção

    return statusFiltro[l.status];
  });
}

  return linhas;
}

    constructor(private fb: FormBuilder, 
        private dialog: MatDialog ,
      private dataService: CapacityPlannerService,
      private capacityEngine: CapacityEngineService // 👈 AQUI
    ) {
this.filtroForm = this.fb.group({
  grupo: ['TODOS'],
  periodo: ['DIARIO'],
  visao: ['ANALISTA'],
  statusProjetos: this.fb.group({
    PLANEJADO: [true],
    EM_ANDAMENTO: [true],
    CONCLUIDO: [true],
    CANCELADO: [true]
  })
});
    }


    ngOnInit(): void {
    forkJoin({
      analistas: this.dataService.getAnalistas(),
      projetos: this.dataService.getProjetos(),
      participacoes: this.dataService.getParticipacoes(),
      feriados: this.dataService.getFeriados(),
      ferias: this.dataService.getFerias()
    }).subscribe(data => {
      
      this.analistasDTO = data.analistas;
      this.projetosDTO = data.projetos;
      this.participacoesDTO = data.participacoes; // 🟢 novo
      this.feriadosDTO = data.feriados;
      this.feriasDTO = data.ferias;

      // Map de projetos por ID
      this.projetosPorId.clear();
      this.projetosDTO.forEach(p => this.projetosPorId.set(p.Id, p));

      // Map de feriados por data (00:00:00)
      this.feriadosPorData.clear();
      this.feriadosDTO.forEach(f => {
        const d = new Date(f.Data);
        const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        this.feriadosPorData.set(key, f);
      });

      // Map de ferias/licenças por analista
      this.feriasPorAnalista.clear();
      this.feriasDTO.forEach(f => {
        if (!this.feriasPorAnalista.has(f.Matricula)) {
          this.feriasPorAnalista.set(f.Matricula, []);
        }
        this.feriasPorAnalista.get(f.Matricula)!.push(f);
      });

      // Map de analistaId → matrícula
      this.analistaIdParaMatricula.clear();
      this.analistasDTO.forEach(a => {
        if (a.Matricula != null) {
          this.analistaIdParaMatricula.set(a.Id_Analista, a.Matricula);
        }
      });

      // Inicializa o engine
      this.capacityEngine.setup({
        participacoes: this.participacoesDTO,
        feriados: this.feriadosDTO,
        ferias: this.feriasDTO,
        analistaIdParaMatricula: this.analistaIdParaMatricula
      }); 

      this.montarLinhasPorVisao();
      this.atualizarMeses();
    });

    this.filtroForm.valueChanges.subscribe(() => {
      this.atualizarMeses();
      this.montarLinhasPorVisao();
    });
  }

    mesSeguinte() {
      const d = new Date(this.mesBase);
      d.setMonth(d.getMonth() + 1);
      this.mesBase = d;
      this.atualizarMeses();
      this.atualizarLinhas(); // 👈 atualiza linhas do mês
    }

  atualizarMeses() {
    this.mesesVisiveis = [0, 1, 2].map(offset => {
      const data = new Date(this.mesBase);
      data.setMonth(this.mesBase.getMonth() + offset);

      const dias = this.getDiasDoMes(data);
      const grupos = this.agruparDias(dias);

     // console.log('Atualizando meses visíveis para mesBase:', this.mesBase);
     // console.log('Meses visíveis atuais:', this.mesesVisiveis);
      return {
        ano: data.getFullYear(),
        mes: data.getMonth() + 1,
        label:
          this.filtroForm.value.periodo === 'MENSAL'
            ? data.getFullYear().toString()
            : data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        dias,
        grupos
      };
    });

    // Atualiza as linhas de acordo com a visão ATUAL
    this.montarLinhasPorVisao();
  }



    getDiasDoMes(data: Date): Date[] {
      const dias: Date[] = [];
      const total = new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= total; i++) {
        dias.push(new Date(data.getFullYear(), data.getMonth(), i));
      }
      return dias;
    }

    agruparDias(dias: Date[]): GrupoPeriodo[] {
      const periodo = this.filtroForm.value.periodo;

      if (periodo === 'DIARIO') {
        return dias.map(d => ({ label: d.getDate().toString(), dias: [d] }));
      }

      if (periodo === 'SEMANAL') {
        const semanas: GrupoPeriodo[] = [];
        let atual: Date[] = [];
        let inicio!: Date;
        const mesAtual = dias[0].getMonth();

        dias.forEach(d => {
          if (!atual.length) inicio = d;
          atual.push(d);

          if (d.getDay() === 0) {
            semanas.push({
              label: inicio.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
              dias: atual.filter(x => x.getMonth() === mesAtual)
            });
            atual = [];
          }
        });

        if (atual.length) {
          semanas.push({
            label: inicio.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            dias: atual.filter(x => x.getMonth() === mesAtual)
          });
        }

        return semanas;
      }

      // MENSAL
      return [{
        label: dias[0].toLocaleDateString('pt-BR', { month: 'short' }),
        dias
      }];
    }



  public getHorasGrupo(grupo: GrupoPeriodo, linha: LinhaPlanner): number {
    return grupo.dias.reduce((total, dia) => {
      const celula = this.capacityEngine.getCapacidadeDia(linha, dia);
      return total + (celula.horas ?? 0);
    }, 0);
  }
  
  formatHoras(horas: any): string {
    const num = Number(horas);
    if (isNaN(num)) return '0';
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  }

  

  private montarLinhas(): LinhaAnalista[] {
    return this.analistasDTO.map(a => ({
      tipo: 'ANALISTA',
      analistaId: a.Id_Analista,
      nome: a.Nom_Analista,
      grupo: a.Grupo
    }));
  }
  
  public isFimDeSemana(d: Date): boolean {
    return d.getDay() === 0 || d.getDay() === 6;
  } 

  public getValorCelula(grupo: GrupoPeriodo, linha: LinhaPlanner): string {
    const periodo = this.filtroForm.value.periodo;

    // ===== DIÁRIO =====
    if (periodo === 'DIARIO') {
      const dia = grupo.dias[0];
      const celula = this.capacityEngine.getCapacidadeDia(linha, dia);


      // Se houver status (FD, F, A, L) → mostra letra
      if (celula.status) return celula.status;

      // Senão → mostra horas (inclusive 0)
      return this.formatHoras(celula.horas);
    }

    // ===== SEMANAL / MENSAL =====
    let totalHoras = 0;

    for (const dia of grupo.dias) {
      const celula = this.capacityEngine.getCapacidadeDia(linha, dia);


      // Letras nunca aparecem fora do diário
      // Apenas ignoram a soma
      if (!celula.status) {
        totalHoras += celula.horas ?? 0;
      }
    }

    return this.formatHoras(totalHoras);
  }

  getStatusDiario(grupo: GrupoPeriodo, linha: LinhaPlanner): 'F' | 'A' | 'L' | 'FD' | null {
    if (this.filtroForm.value.periodo !== 'DIARIO') return null;

    const dia = grupo.dias[0];
    const celula = this.capacityEngine.getCapacidadeDia(linha, dia); 

    return celula.status ?? null;
  }


  // Ajuste no montarLinhasPorProjeto para receber os dias de cada mês
  private montarLinhasPorProjeto(): LinhaProjeto[] {
    return this.projetosDTO.map(p => ({
      tipo: 'PROJETO',
      projetoId: p.Id,
      nome: p.Nome,
      grupo: 'PROJETOS',
    status: p.Status // 🔥 importante
    }));
  } 
  private montarLinhasPorVisao() {
    if (this.filtroForm.value.visao === 'PROJETO') {
      this.linhas = this.montarLinhasPorProjeto();
    } else {
      this.linhas = this.montarLinhas();
    }
  }

  private atualizarLinhas() {
    const visao = this.filtroForm.value.visao;
    const mesBase = this.mesBase;

    if (visao === 'PROJETO') {
      this.linhas = this.montarLinhasPorProjeto();
    } else {
      this.linhas = this.montarLinhas();
    }
  }

  mesAnterior() {
    const d = new Date(this.mesBase);
    d.setMonth(d.getMonth() - 1);

    if (d < this.MES_MINIMO) return;

    this.mesBase = d;
    this.atualizarMeses();
    this.atualizarLinhas(); // 👈 atualiza linhas do mês
  }

  private getCelulaAgrupada(grupo: GrupoPeriodo, linha: LinhaPlanner) {

    const periodo = this.filtroForm.value.periodo;

    // ===== DIÁRIO =====
    if (periodo === 'DIARIO') {
      return this.capacityEngine.getCapacidadeDia(linha, grupo.dias[0]);
    }

    // ===== SEMANAL / MENSAL =====
    let totalHoras = 0;
    let hasOverbook = false;
    let hasUnder = false;

    for (const dia of grupo.dias) {

      const celula = this.capacityEngine.getCapacidadeDia(linha, dia);

      if (!celula.status) {
        totalHoras += celula.horas ?? 0;
      }

      if (celula.overbook) {
        hasOverbook = true;
      }

      if (celula.under) {
        hasUnder = true;
      }
    }

    return {
      horas: totalHoras,
      overbook: hasOverbook,
      under: hasUnder
    };
  }

  isOverbook(grupo: GrupoPeriodo, linha: LinhaPlanner): boolean {
    const celula = this.getCelulaAgrupada(grupo, linha);
    return !!celula?.overbook;
  }

  isUnder(grupo: GrupoPeriodo, linha: LinhaPlanner): boolean {
    const celula = this.getCelulaAgrupada(grupo, linha);
    return !!celula?.under;
  }

  getTooltip(grupo: GrupoPeriodo, linha: LinhaPlanner): string {

    const celula = this.getCelulaAgrupada(grupo, linha);

    if (!celula) return '';

    if (this.filtroForm.value.periodo === 'DIARIO') {

      if (celula.status) {
        return `Status: ${celula.status}`;
      }

      if (celula.overbook) {
        return `Overbook: ${celula.horas}h (> 8h)`;
      }

      if (celula.under) {
        return `Subalocado: ${celula.horas}h (< 8h)`;
      }

      return `${celula.horas}h`;
    }

    // Semanal / Mensal
    if (celula.overbook) {
      return `Período com overbooking\nTotal: ${celula.horas}h`;
    }

    if (celula.under) {
      return `Período com subalocação\nTotal: ${celula.horas}h`;
    }

    return `Total: ${celula.horas}h`;
  }

  hasTooltip(grupo: GrupoPeriodo, linha: LinhaPlanner): boolean {
    const celula = this.getCelulaAgrupada(grupo, linha);
    return !!(celula?.overbook || celula?.under);
  }

  getTooltipIfNeeded(grupo: GrupoPeriodo, linha: LinhaPlanner): string | null {

    const celula = this.getCelulaAgrupada(grupo, linha);

    if (!celula) return null;

    if (celula.overbook) {
      return `Overbook: ${celula.horas}h (> 8h)`;
    }

    if (celula.under) {
      return `Subalocado: ${celula.horas}h (< 8h)`;
    }

    return null; // 🔥 importante
  }

  abrirResumoProjeto(linha: LinhaProjeto) {
    const projeto = this.projetosPorId.get(linha.projetoId);
    if (!projeto) return;

    const analistasMap = new Map<number,string>();
    this.analistasDTO.forEach(a => analistasMap.set(a.Id_Analista, a.Nom_Analista));

    this.dialog.open(ProjectSummaryDialogComponent, {
      width: '95vw',
      maxWidth: '1200px',
      height: '80vh',
      maxHeight: '90vh',
      data: {
        projeto,
        participacoes: this.participacoesDTO,
        analistasMap
      }
    });
  }

private parseDateOnlyFromApi(dateStr: string): Date {
  const d = new Date(dateStr);
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate()
  );
}

  }



