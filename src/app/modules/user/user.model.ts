export interface User {
  Id?: number;
  AnalistaId?: number;
  Perfil: number;
  Username: string;
  PasswordHash?: string;
  MFAAtivo?: boolean; // novo campo
  // TOTPSecret não deve aparecer no frontend
}