import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alocacao } from './alocacao.model';

@Injectable({ providedIn: 'root' })
export class AlocacaoService {

  private apiUrl = 'http://localhost:3000/alocacao';

  constructor(private http: HttpClient) {}

  listar(): Observable<Alocacao[]> {
    return this.http.get<Alocacao[]>(this.apiUrl);
  }

  criar(dados: Alocacao): Observable<any> {
    return this.http.post(this.apiUrl, dados);
  }

  atualizar(id: number, dados: Alocacao): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dados);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
