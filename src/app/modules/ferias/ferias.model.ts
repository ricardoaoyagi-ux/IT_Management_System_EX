export interface Ferias {
  Id?: number;           // chave primária auto-increment (pode ser sequencia interna)
  Matricula: number;
  Nom_Analista: string;
  Aquisitivo: number;
  Dt_Inicio: string;     // YYYY-MM-DD
  Dt_Fim: string;        // YYYY-MM-DD
  Pendente: boolean;
  Sequencia: number;
  Nota: string;
  Dt_Cadastro: string;        // YYYY-MM-DD
  Usr_Cadastro: string;        // YYYY-MM-DD
}
