import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeboxContrato, TimeboxProjeto, TimeboxProjetoParticipacao } from './timebox.model';
import { Analista } from './analista.model';


@Injectable({ providedIn: 'root' })
export class TimeboxService {

  private baseUrl = 'http://localhost:3000/timebox';
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Contratos
  listarContratos(): Observable<TimeboxContrato[]> {
    return this.http.get<TimeboxContrato[]>(`${this.baseUrl}/contratos`);
  }
  criarContrato(c: TimeboxContrato): Observable<any> {
    return this.http.post(`${this.baseUrl}/contratos`, c);
  }
  atualizarContrato(id: number, c: TimeboxContrato): Observable<any> {
    return this.http.put(`${this.baseUrl}/contratos/${id}`, c);
  }
  deletarContrato(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/contratos/${id}`);
  }

  // Projetos
  criarProjeto(p: TimeboxProjeto): Observable<any> {
    return this.http.post(`${this.baseUrl}/projetos`, p);
  }
  atualizarProjeto(id: number, p: TimeboxProjeto): Observable<any> {
    return this.http.put(`${this.baseUrl}/projetos/${id}`, p);
  }
  deletarProjeto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/projetos/${id}`);
  }

  // Membros
  vincularMembro(m: TimeboxProjetoParticipacao): Observable<any> {
    return this.http.post(`${this.baseUrl}/membros`, m);
  }
  atualizarMembro(id: number, m: TimeboxProjetoParticipacao): Observable<any> {
    return this.http.put(`${this.baseUrl}/membros/${id}`, m);
  }
  deletarMembro(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/membros/${id}`);
  }

  listarAnalistas(): Observable<Analista[]> {
  return this.http.get<Analista[]>(`${this.apiUrl}/analistas/dropdown`);
}
}
