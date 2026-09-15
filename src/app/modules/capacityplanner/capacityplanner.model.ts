export type TipoLinhaPlanner = 'ANALISTA' | 'PROJETO';

export interface PlannerMes {
  ano: number;
  mes: number;
  label: string;
  dias: Date[];
  grupos: GrupoPeriodo[];
}

export interface GrupoPeriodo {
  label: string;
  dias: Date[];
}

export interface PlannerCelula {
  horas: number;
  status?: 'L' | 'F' | 'A' | 'FD';
  overbook?: boolean;
  under?: boolean;
}

export interface LinhaBase {
  nome: string;
  grupo: 'SUSTAIN' | 'PROJETOS';
}

export interface LinhaAnalista extends LinhaBase {
  tipo: 'ANALISTA';
  analistaId: number;
}
export type LinhaPlanner = LinhaAnalista | LinhaProjeto;

export interface LinhaProjeto extends LinhaBase {
  tipo: 'PROJETO';
  projetoId: number;
  status?: 'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';

}
 

export interface AnalistaDTO {
  Id_Analista: number;
  Matricula: number;
  Nom_Analista: string;
  Dt_Inicio: string;
  Dt_Fim: string;
  Grupo: 'SUSTAIN' | 'PROJETOS';
}

export interface TimeboxProjetoDTO {
  Id: number;
  Nome: string;
  Descricao?: string;
  HorasPrevistas?: number;
  HorasConsumidas?: number;
  DataInicio?: string;
  DataFim?: string;
  DataPrevisaoFim?: string;
  DataFimReal?: string;
  Status?: 'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  TimeboxContratoId?: number;

  // ⚡ Novo campo: link para o contrato
  contrato?: TimeboxContratoDTO;
}

export interface TimeboxContratoDTO {
  Id: number;
  ClienteId: number;
  Descricao?: string;
  HorasContratadas: number;
  HorasConsumidas?: number;
  DataInicio?: string;
  DataFim?: string;
  Status?: 'ATIVO' | 'ENCERRADO';
}

export interface FeriadoDTO {
  Id: number;
  Data: string; // yyyy-MM-dd
  Nome: string;
}

export interface FeriasDTO {
  Id: number;
  Matricula: number;
  Dt_Inicio: string;
  Dt_Fim: string;
  Nota?: string; // F / L / A
} 

export interface ParticipacaoDTO {
  Id: number;
  TimeboxProjetoId: number;
  UserId: number;
  Papel?: string;
  DataInicio: string; // ISO date (yyyy-mm-dd)
  DataFim: string;    // ISO date (yyyy-mm-dd)
  HorasPorDia: number;
}