import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agrupamento } from './agrupamento.model';

@Injectable({ providedIn: 'root' })
export class AgrupamentoService {

  private apiUrl = 'http://localhost:3000/agrupamento';

  constructor(private http: HttpClient) {}

  listar(): Observable<Agrupamento[]> {
    return this.http.get<Agrupamento[]>(this.apiUrl);
  }

  criar(dados: Agrupamento): Observable<any> {
    return this.http.post(this.apiUrl, dados);
  }

  atualizar(id: number, dados: Agrupamento): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dados);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  buscar(codSistema: number, codModulo: number) {
    return this.http.get<Agrupamento[]>(
      `${this.apiUrl}/buscar`,
      {
        params: {
          Cod_Sistema: codSistema,
          Cod_Modulo: codModulo
        }
      }
    );
  }

  getNextCod(
    codSistema: number,
    codModulo: number 
  ): Observable<{ nextcod_agrupamento: number }> {
  
    return this.http.get<{ nextcod_agrupamento: number }>(
      `${this.apiUrl}/next-cod`,
      {
        params: {
          cod_sistema: codSistema,
          Cod_Modulo: codModulo
        }
      }
    );
  }
}
