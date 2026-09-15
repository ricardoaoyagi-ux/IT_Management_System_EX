import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sistema } from './sistema.model';

@Injectable({ providedIn: 'root' })
export class SistemaService {

  private apiUrl = 'http://localhost:3000/sistema'; // ajuste

  constructor(private http: HttpClient) {}

  listar(): Observable<Sistema[]> {
    return this.http.get<Sistema[]>(this.apiUrl);
  }

  criar(dados: Sistema): Observable<any> {
    return this.http.post(this.apiUrl, dados);
  }

  atualizar(id: number, dados: Sistema): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dados);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
