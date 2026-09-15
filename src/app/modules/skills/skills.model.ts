export interface Skill {
  Id?: number;
  Matricula?: number;
  Nom_Analista?: string;

  SistemaA?: number;
  SistemaA_Cadastro?: number;
  SistemaA_Sinistro?: number;
  SistemaA_Cobranca?: number;
  SistemaA_Emissao?: number;
  SistemaA_Comissao?: number;
  SistemaA_Contabil?: number;
  SistemaA_Cosseguro?: number;
  SistemaA_Cadenas?: number;
  SistemaA_SSR?: number;

  SistemaB?: number;
  SistemaC?: number;

  SistemaD_Auto?: number;
  SistemaD_Auto_Front?: number;
  SistemaD_Vida?: number;
  SistemaD_Vida_Front?: number;
  SistemaD_Residencial?: number;
  SistemaD_Residencial_Front?: number;

  SistemaE?: number;
  SistemaF?: number;
  'BI-Cognos'?: number;

  SistemaG?: number;
  SistemaH?: number;
  Crm_salesforce?: number;

  'PL-SQL'?: number;
  Webmethods?: number;
  Java?: number;
  'Java-API'?: number;
  Angular?: number;

  DataStage?: number;
  PowerCenter?: number;
  Cognos?: number;
  Forms?: number;
  Gestao?: number;
  
  media?: number; // 🔹 Adicione isso
}
