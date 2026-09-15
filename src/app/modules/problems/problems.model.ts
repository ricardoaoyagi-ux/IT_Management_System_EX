export interface Problem {
  Id?: number;
  Cod_Problem?: number;
  Nom_Problem: string;
  Desc_Problem: string;
  Dt_Abertura?: string;        // YYYY-MM-DD
  Dt_Encerramento?: string;    // YYYY-MM-DD
  Status: number;
  Tip_Problem: number;
  PM_CLIENTE?: string;
  Analista_Cadastro?: string;
  Analista_Responsavel?: string;
}
