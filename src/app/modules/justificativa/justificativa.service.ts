import { Observable } from 'rxjs';
import { Justificativa } from './justificativa.model';

export interface JustificativaBaseService {
  listar(): Observable<Justificativa[]>;
  listarMeus(username: string): Observable<Justificativa[]>;
  atualizarObs(cod_incidente: string, obs: string,
    motivo_id: number | null): Observable<any>;

  
}

