export interface Analista {
  Id_Analista?: number;
  Matricula: number;
  Nom_Analista: string;
  Lider_Gerente?: string; // 👈 NOVO CAMPO
  
  NOM_USUARIO_SIG?: string;
  CID_RESIDENCIA?: string;
  UF_RESIDENCIA?: string;
  
  Id_Fornecedor: string;
  Id_Cliente: string;
  Alocacao: string;
  Senioridade: string;
  Rate: number;
  Dt_Inicio: string;
  Dt_Fim: string;
}