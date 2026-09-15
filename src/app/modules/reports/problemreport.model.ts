export interface ProblemReport {
  Id: number;
  Nom_Problem: string;
  Dt_Abertura: Date | null;
  Dt_Encerramento: Date | null;
  Desc_Tip_Problem?: string;
  Desc_Status?: string;
  Descricao?: string;
  cont_inc_problem?: number;
}
