export interface Plantao {
    Id?: number;
    data_ini?: string;               // YYYY-MM-DD
    data_fim?: string;               // YYYY-MM-DD
    fechamento?: boolean;            // true/false
    nivel1_sistemaA?: string;
    nivel1_sistemaD?: string;
    nivel1_codeadmin?: string;
    nivel2?: string;
    obs?: string;
    data_alteracao?: string;         // YYYY-MM-DD HH:mm:ss
    usuario_alteracao?: string;
  }
  