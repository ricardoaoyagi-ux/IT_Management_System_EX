export interface TimeboxContrato {
  Id: number;
  ClienteId: number;
  Descricao: string;
  HorasContratadas: number;
  HorasConsumidas: number;
  DataInicio?: string;
  DataFim?: string;
  Status?: string;
  Projetos?: TimeboxProjeto[];
}

export interface TimeboxProjeto {
  Id?: number;
  TimeboxContratoId: number;
  Nome: string;
  Descricao?: string;
  HorasPrevistas: number;
  HorasConsumidas?: number;
  DataInicio?: string;
  DataPrevisaoFim?: string;
  DataFimReal?: string;
  Status?: string;

  // 👇 vem do backend
  Participacoes?: TimeboxProjetoParticipacao[];
}

export interface TimeboxProjetoParticipacao {
  Id: number;
  TimeboxProjetoId: number;
  UserId: number;

  Nome?: string;   // vindo do join
  Papel?: string;

  DataInicio: string;
  DataFim: string;

  HorasPorDia: number;
}
