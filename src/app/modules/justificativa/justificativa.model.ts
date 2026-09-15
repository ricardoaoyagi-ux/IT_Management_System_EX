export interface Justificativa {
  cod_incidente: string;
  Solucionador: string;
  data: string; // ← campo genérico
  obs?: string;
  motivo_Id: number;
}