import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aplicacao } from './aplicacoes.model';

@Injectable({
  providedIn: 'root'
})
export class AplicacoesService {
  private baseUrl = 'http://localhost:3000/aplicacoes';

  constructor(private http: HttpClient) {}

  listar(): Observable<Aplicacao[]> {
    return this.http.get<Aplicacao[]>(this.baseUrl);
  }

  criar(aplicacao: Aplicacao): Observable<any> {
    return this.http.post(this.baseUrl, aplicacao);
  }

  atualizar(codigo: number, aplicacao: Aplicacao): Observable<any> {
    return this.http.put(`${this.baseUrl}/${codigo}`, aplicacao);
  }

  deletar(codigo: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${codigo}`);
  }
}
