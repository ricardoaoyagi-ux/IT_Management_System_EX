import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RCA } from './rca.model';

@Injectable({
  providedIn: 'root'
})
export class RcaService {

  private url = 'http://localhost:3000/rca';

  constructor(private http: HttpClient) {}

  listar(): Observable<RCA[]> {
    return this.http.get<RCA[]>(this.url);
  }

  criar(rca: RCA): Observable<{ Cod_RCA: number }> {
    return this.http.post<{ Cod_RCA: number }>(this.url, rca);
  }

  atualizar(id: number, rca: RCA): Observable<any> {
    return this.http.put(`${this.url}/${id}`, rca);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  buscarRCA(query: string): Observable<RCA[]> {
    return this.http.get<RCA[]>(`${this.url}/busca?query=${query}`);
  }
}
