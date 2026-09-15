export interface Incidente {
  Id?: number;
  Id_Incidente: string;
  Sistema: number;
  Modulo: string;
  Tip_Solicitacao: string;
  Cod_Classificacao1: string;
  Cod_Classificacao2: string;
  Cod_Classificacao3: string;
  Desc_Incidente: string;
  Desc_Resolucao: string;
  Dt_Resolucao: string;   // YYYY-MM-DD
  Dt_Abertura: string;    // YYYY-MM-DD
  Dt_Carga: string;       // YYYY-MM-DD
  Solucionador: string;
  RCA: boolean;
  Cod_RCA: number;
  St: number;
  Cod_Problem?: string; // 👈 ADICIONE ESTA LINHA
}
