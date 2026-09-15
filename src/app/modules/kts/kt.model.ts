export interface KT {
  cod_kt?: number;

  titulo: string;
  descricao: string;
  participantes: string;

  responsavel_kt: string;
  area_origem?: string;
  area_destino?: string;

  data_envio: string;
  data_realizacao?: string;

  aceito: 'S' | 'N';
  data_aceite?: string;
  observacao_aceite?: string;

  data_inicio_vigencia?: string;

  status_kt: string;

  link_material?: string;
  link_gravacao?: string;

  ativo?: 'S' | 'N';
  data_criacao?: string;
  data_atualizacao?: string;
}
