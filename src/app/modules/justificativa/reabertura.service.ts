
import { JustificativaBaseService } from './justificativa.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Justificativa } from './justificativa.model';

@Injectable({ providedIn: 'root' })
export class JustificativaReaberturaService implements JustificativaBaseService {

  apiUrl = 'http://localhost:3000/justificativa-reabertura';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Justificativa[]>(this.apiUrl);
  }

  listarMeus(username: string) {
    return this.http.get<Justificativa[]>(`${this.apiUrl}/meus/${username}`);
  }

  atualizarObs(cod_incidente: string, obs: string,  motivo_id: number | null) {
    const usuario_upd = JSON.parse(localStorage.getItem('user')!).username;
    return this.http.put(`${this.apiUrl}/${cod_incidente}/obs`, { obs, 
      motivo_id, usuario_upd });
  }
}
