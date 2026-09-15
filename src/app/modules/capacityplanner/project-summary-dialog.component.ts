import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ParticipacaoDTO ,  FeriasDTO, FeriadoDTO} from './capacityplanner.model';
import { CapacityEngineService } from './capacityengine.service';

@Component({
  selector: 'app-project-summary-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title class="header">
      <div class="titulo">
        {{ data.projeto.Nome }}
      </div>

      <div class="status">
        {{ data.projeto.Status }}
      </div>
    </h2>

    <div mat-dialog-content class="content">

      <!-- CONTRATO -->
<section class="bloco contrato" *ngIf="data.projeto.contrato">
  <label>Contrato</label>
  <div class="valor">{{ data.projeto.contrato.Descricao }}</div>
</section>

      <!-- DESCRIÇÃO -->
      <section class="bloco">
        <h3>Descrição</h3>
        <p class="descricao">
          {{ data.projeto.Descricao || '—' }}
        </p>
      </section>

      <!-- INDICADORES --> 
<section class="bloco indicadores">
  <!-- HORAS -->
  <div class="horas">
    <div class="hora-item">
      <label>Horas Previstas</label>
      <div class="valor">{{ data.projeto.HorasPrevistas ?? '—' }}h</div>
    </div>

    <div class="hora-item">
      <label>Horas Consumidas</label>
      <div class="valor">{{ data.projeto.HorasConsumidas ?? '—' }}h</div>
    </div>
  </div>

  <!-- DATAS EM UMA LINHA -->
<div class="datas">
  <div class="data-item">
    <label>Data Início</label>
    <div>{{ data.projeto.DataInicio | date:'dd/MM/yyyy' }}</div>
  </div>

  <div class="data-item">
    <label>Data Fim</label>
    <div>{{ data.projeto.DataPrevisaoFim | date:'dd/MM/yyyy' }}</div>
  </div>

  <div class="data-item">
    <label>Data Fim Real</label>
    <div>{{ data.projeto.DataFimReal ? (data.projeto.DataFimReal | date:'dd/MM/yyyy') : '—' }}</div>
  </div>
</div>
</section>

<!-- PARTICIPANTES -->
<section class="bloco">
  <h3>Participantes</h3>
  <div class="participantes">
    <div class="participante" *ngFor="let p of participantes">
      <div class="nome">{{ p.nome }}</div>
      <div class="horas">
        {{ p.horasAlocadas }}h alocado
        ({{ p.horasUteis }}h úteis)
      </div>
    </div>
  </div>
</section>

<!-- TOTAIS -->
<section class="bloco totais">
  <div>
    <label>Total Horas Alocadas</label>
<div class="valor">{{ totalAlocado | number:'1.0-0' }}h</div>
  </div>

  <div>
    <label>Total Horas Úteis</label>
<div class="valor">{{ totalUteis | number:'1.0-0' }}h</div>
  </div>
</section>


    </div>

    <div mat-dialog-actions align="end">
      <button mat-raised-button color="primary" mat-dialog-close>
        Fechar
      </button>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .titulo {
      font-weight: 600;
      font-size: 22px;
    }

    .status {
      padding: 4px 12px;
      border-radius: 12px;
      background: #e0e0e0;
      font-size: 12px;
    }

    .content {
      min-width: 900px;      /* aumento horizontal */
      max-width: 95vw;
      min-height: 500px;     /* aumento vertical */
      max-height: 80vh;
      overflow: auto;
      padding: 16px 24px;
    }

    .bloco {
      margin-bottom: 24px;
    }

    .contrato label {
      font-size: 12px;
      color: #666;
      display: block;
    }

    .contrato .valor {
      font-weight: 600;
      font-size: 16px;
      margin-top: 4px;
    }

    .descricao {
      white-space: pre-line;
    }
 

/* Linha de Horas */
.bloco.indicadores .horas {
  display: flex;
  gap: 32px;           /* distância entre Horas Previstas e Consumidas */
  margin-bottom: 16px; /* separa das datas */
}

.bloco.indicadores .hora-item {
  display: flex;
  flex-direction: column; /* label em cima, valor embaixo */
  min-width: 120px;       /* largura mínima para não quebrar */
}

/* Datas continuam iguais */
.bloco.indicadores .datas {
  display: flex;
  gap: 32px;
}

.bloco.indicadores .data-item {
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

    label {
      font-size: 12px;
      color: #666;
      display: block;
    }

    .valor {
      font-weight: 600;
      font-size: 16px;
    }

    .participantes {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .participante {
      display: flex;
      justify-content: space-between;
      padding: 6px 10px;
      background: #f5f5f5;
      border-radius: 6px;
    }

    .totais {
      display: flex;
      justify-content: space-between;
      background: #fafafa;
      padding: 12px;
      border-radius: 8px;
    }
  `]
})
export class ProjectSummaryDialogComponent {

    participantes: {
  nome: string;
  horasAlocadas: number;
  horasUteis : number; // opcional por enquanto
}[] = [];

totalAlocado = 0;
totalUteis = 0; // opcional

  participantesFake = [
    { nome: 'Fulano 1', horasAlocadas: 120, horasUteis: 100 },
    { nome: 'Fulano 2', horasAlocadas: 80, horasUteis: 70 }
  ];

  totalAlocadoFake = 200;
  totalUteisFake = 170;

constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  private capacityEngine: CapacityEngineService
) {}


ngOnInit(): void {

  const projetoId = this.data.projeto.Id;

  const resumo = this.capacityEngine.getResumoProjeto(projetoId);

  this.participantes = resumo.participantes.map(p => ({
    nome: this.data.analistasMap.get(p.userId) || '—',
    horasAlocadas: p.horasAlocadas,
    horasUteis: p.horasUteis
  }));

  this.totalAlocado = resumo.totalAlocado;
  this.totalUteis = resumo.totalUteis;
}



// Retorna todos os dias do projeto (entre DataInicio e DataPrevisaoFim)
private getDiasProjeto(projeto: any): Date[] {
  const start = new Date(projeto.DataInicio);
  const end = new Date(projeto.DataPrevisaoFim);
  const dias: Date[] = [];
  let d = new Date(start);
  while (d <= end) {
    dias.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return dias;
}

// Retorna os dias em que a participação ocorre dentro do período do projeto
private getDiasParticipacao(p: ParticipacaoDTO, diasProjeto: Date[]): Date[] {
  const inicio = new Date(p.DataInicio);
  const fim = new Date(p.DataFim);
  return diasProjeto.filter(d => d >= inicio && d <= fim);
}

// Retorna o status de ausência ou feriado
private getStatusDia(
  userId: number,
  dia: Date
): 'F' | 'A' | 'L' | 'FD' | null {

  const diaNorm = this.normalizeDate(dia);

  // 🔹 Feriado
  const feriado: FeriadoDTO | undefined =
    this.data.feriados?.find((f: FeriadoDTO) => {

      const fDia = this.normalizeDate(new Date(f.Data));

      return fDia.getTime() === diaNorm.getTime();
    });

  if (feriado) return 'FD';

  // 🔹 Férias / Licença / Ausência
  const matricula = this.data.analistasMapInverse?.get(userId);
  if (!matricula) return null;

  const ferias: FeriasDTO[] =
    this.data.ferias?.filter((f: FeriasDTO) =>
      f.Matricula === matricula
    ) ?? [];

  for (const f of ferias) {

    const inicio = this.normalizeDate(new Date(f.Dt_Inicio));
    const fim = this.normalizeDate(new Date(f.Dt_Fim)); 
    if (
      diaNorm.getTime() >= inicio.getTime() &&
      diaNorm.getTime() <= fim.getTime()
    ) {

      if (f.Nota === 'Ausencia') return 'A';
      if (f.Nota === 'Licença') return 'L';
      return 'F';
    }
  }

  return null;
}

private normalizeDate(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

}
