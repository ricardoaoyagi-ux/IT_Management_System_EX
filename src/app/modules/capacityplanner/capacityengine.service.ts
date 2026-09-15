import { Injectable } from '@angular/core';
import { ParticipacaoDTO, PlannerCelula } from './capacityplanner.model';
import { FeriadoDTO, FeriasDTO } from './capacityplanner.model';
import { LinhaPlanner } from './capacityplanner.model';

@Injectable({ providedIn: 'root' })
export class CapacityEngineService {

  private participacoes: ParticipacaoDTO[] = [];

  private feriadosPorData = new Map<number, FeriadoDTO>();
  private feriasPorMatricula = new Map<number, FeriasDTO[]>();
  private analistaIdParaMatricula = new Map<number, number>();

  // 🔥 Índices
  private participacoesPorUser = new Map<number, ParticipacaoDTO[]>();
  private participacoesPorProjeto = new Map<number, ParticipacaoDTO[]>();

  // 🔥 Cache
  private cacheCelula = new Map<string, PlannerCelula>();

  // ==============================================================
  // SETUP
  // ==============================================================

  setup(params: {
    participacoes: ParticipacaoDTO[];
    feriados: FeriadoDTO[];
    ferias: FeriasDTO[];
    analistaIdParaMatricula: Map<number, number>;
  }) {

    this.cacheCelula.clear();
    this.participacoesPorUser.clear();
    this.participacoesPorProjeto.clear();
    this.feriadosPorData.clear();
    this.feriasPorMatricula.clear();

    this.analistaIdParaMatricula = params.analistaIdParaMatricula;

    // 🔹 Normaliza participações + cria índices
    for (const p of params.participacoes) {

      const horas = typeof p.HorasPorDia === 'string'
        ? parseFloat(p.HorasPorDia)
        : p.HorasPorDia;

      const participacao: ParticipacaoDTO = {
        ...p,
        HorasPorDia: horas
      };

      // Index por User
      if (!this.participacoesPorUser.has(participacao.UserId)) {
        this.participacoesPorUser.set(participacao.UserId, []);
      }
      this.participacoesPorUser.get(participacao.UserId)!.push(participacao);

      // Index por Projeto
      if (!this.participacoesPorProjeto.has(participacao.TimeboxProjetoId)) {
        this.participacoesPorProjeto.set(participacao.TimeboxProjetoId, []);
      }
      this.participacoesPorProjeto.get(participacao.TimeboxProjetoId)!.push(participacao);
    }

    // Feriados
for (const f of params.feriados) {
  const d = new Date(f.Data);            // parse direto do ISO string
  const dNorm = this.normalizeDate(d);  // só data, sem hora
  this.feriadosPorData.set(dNorm.getTime(), f);
}

    // Férias
    for (const f of params.ferias) {
      if (!this.feriasPorMatricula.has(f.Matricula)) {
        this.feriasPorMatricula.set(f.Matricula, []);
      }
      this.feriasPorMatricula.get(f.Matricula)!.push(f);
    }
  }

  // ==============================================================
  // API PRINCIPAL
  // ==============================================================

  getCapacidadeDia(linha: LinhaPlanner, dia: Date): PlannerCelula {

    
    const diaNormalizado = this.normalizeDate(dia);
 
    const key = `${linha.tipo}_${linha.tipo === 'ANALISTA' ? linha.analistaId : linha.projetoId}_${diaNormalizado.getTime()}`;

    // 🔥 CACHE
    const cached = this.cacheCelula.get(key);
    if (cached) return cached;

    if (this.isFimDeSemana(diaNormalizado)) {
      return this.saveCache(key, { horas: 0 });
    }

    if (this.isFeriado(diaNormalizado)) {
      return this.saveCache(key, { horas: 0, status: 'FD' });
    }

    let resultado: PlannerCelula = { horas: 0 };

    // ==========================================================
    // ANALISTA
    // ==========================================================
    if (linha.tipo === 'ANALISTA') {

      const ausencia = this.getStatusAusencia(linha.analistaId, diaNormalizado);
      if (ausencia) {
        return this.saveCache(key, { horas: 0, status: ausencia });
      }

      const participacoes = this.participacoesPorUser.get(linha.analistaId) ?? [];

      let total = 0;

      for (const p of participacoes) {
const inicio = this.parseDateFromApi(p.DataInicio);
const fim = this.parseDateFromApi(p.DataFim);
        if (this.isBetween(diaNormalizado, inicio , fim )) {
          total += p.HorasPorDia || 0;
        }
      }

      if (total === 0 && linha.grupo === 'SUSTAIN') {
        total = 8;
      }

      resultado = {
        horas: total,
        overbook: total > 8,
        under: linha.grupo === 'PROJETOS' && total > 0 && total < 8
      };

      return this.saveCache(key, resultado);
    }

    // ==========================================================
    // PROJETO
    // ==========================================================
    if (linha.tipo === 'PROJETO') {

      const participacoes = this.participacoesPorProjeto.get(linha.projetoId) ?? [];

      let total = 0;

      for (const p of participacoes) {

const inicio = this.parseDateFromApi(p.DataInicio);
const fim = this.parseDateFromApi(p.DataFim);
        if (!this.isBetween(diaNormalizado, inicio,fim )) {
          continue;
        }

        const ausencia = this.getStatusAusencia(p.UserId, diaNormalizado);
        if (ausencia) continue;

        total += p.HorasPorDia || 0;
      }

      resultado = { horas: total };

      return this.saveCache(key, resultado);
    }

    return this.saveCache(key, { horas: 0 });
  }

  // ==============================================================
  // CACHE HELPER
  // ==============================================================

  private saveCache(key: string, value: PlannerCelula): PlannerCelula {
    this.cacheCelula.set(key, value);
    return value;
  }

  // ==============================================================
  // REGRAS
  // ==============================================================

  private isFimDeSemana(d: Date): boolean {
    const day = d.getDay();
    return day === 0 || day === 6;
  }

  private isFeriado(d: Date): boolean {
    return this.feriadosPorData.has(d.getTime());
  }

private getStatusAusencia(analistaId: number, dia: Date): 'F' | 'A' | 'L' | null {
  const matricula = this.analistaIdParaMatricula.get(analistaId);
  if (!matricula) return null;

  const ferias = this.feriasPorMatricula.get(matricula) ?? [];

  for (const f of ferias) {
    const inicio = this.normalizeDate(new Date(f.Dt_Inicio));
    const fim = this.normalizeDate(new Date(f.Dt_Fim));

    if (this.isBetween(dia, inicio, fim)) {
      if (f.Nota === 'Ausencia') return 'A';
      if (f.Nota === 'Licença') return 'L';
      return 'F';
    }
  }

  return null;
}

  // ==============================================================
  // HELPERS
  // ==============================================================

private isBetween(d: Date, ini: Date, fim: Date): boolean {
  const day = this.normalizeDate(d).getTime();
  const start = this.normalizeDate(ini).getTime();
  const end = this.normalizeDate(fim).getTime();
  return day >= start && day <= end;
}
  private parseDateOnly(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private normalizeDate(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

 getResumoProjeto(projetoId: number): {
  participantes: {
    userId: number;
    horasAlocadas: number;
    horasUteis: number;
  }[];
  totalAlocado: number;
  totalUteis: number;
} {

  const participacoes = this.participacoesPorProjeto.get(projetoId) ?? [];

  const resumoPorUser = new Map<number, {
    horasAlocadas: number;
    horasUteis: number;
  }>();

  for (const p of participacoes) {

    const horasPorDia = Number(p.HorasPorDia) || 0;

    let d = this.normalizeDate(new Date(p.DataInicio));
    const fim = this.normalizeDate(new Date(p.DataFim));

    while (d <= fim) {

      // ignora sábado/domingo
      if (!this.isFimDeSemana(d)) {

        // 🔹 Horas vendidas (sempre soma dia útil)
        const atual = resumoPorUser.get(p.UserId) ?? {
          horasAlocadas: 0,
          horasUteis: 0
        };

        atual.horasAlocadas += horasPorDia;

        // 🔹 Horas úteis (usa mesma regra da visão diária)
        const status = this.getStatusAusencia(p.UserId, d);

        if (!this.isFeriado(d) && status === null) {
          atual.horasUteis += horasPorDia;
        }

        resumoPorUser.set(p.UserId, atual);
      }

      d = new Date(d);
      d.setDate(d.getDate() + 1);
    }
  }

  const participantes = Array.from(resumoPorUser.entries()).map(([userId, valores]) => ({
    userId,
    horasAlocadas: valores.horasAlocadas,
    horasUteis: valores.horasUteis
  }));

  const totalAlocado = participantes
    .reduce((acc, p) => acc + p.horasAlocadas, 0);

  const totalUteis = participantes
    .reduce((acc, p) => acc + p.horasUteis, 0);

  return {
    participantes,
    totalAlocado,
    totalUteis
  };
}
private parseDateFromApi(dateStr: string | Date): Date {

  if (dateStr instanceof Date) {
    return this.normalizeDate(dateStr);
  }

  const d = new Date(dateStr);

  // 🔥 usa UTC para evitar shift de fuso
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate()
  );
}
}

