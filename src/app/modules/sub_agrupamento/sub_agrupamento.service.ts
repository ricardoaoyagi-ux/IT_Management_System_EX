import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubAgrupamento } from './sub_agrupamento.model';

@Injectable({
  providedIn: 'root'
})
export class SubAgrupamentoService {

  private url = 'http://localhost:3000/sub_agrupamento';

  constructor(private http: HttpClient) {}

  listar(): Observable<SubAgrupamento[]> {
    return this.http.get<SubAgrupamento[]>(this.url);
  }

  criar(item: SubAgrupamento): Observable<any> {
    return this.http.post(this.url, item);
  }

  atualizar(id: number, item: SubAgrupamento): Observable<any> {
    return this.http.put(`${this.url}/${id}`, item);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

    // 🔍 BUSCAR (filtrado)
    buscar(codSistema: number, 
           codModulo: number, 
           codAgrupamento: number): Observable<SubAgrupamento[]> {
      return this.http.get<SubAgrupamento[]>(
        `${this.url}/buscar`,
        {
          params: {
            cod_sistema: codSistema,
            Cod_Modulo: codModulo,
            cod_agrupamento: codAgrupamento
          }
        }
      );
    }

    getNextCodSub(
      codSistema: number,
      codModulo: number,
      codAgrupamento: number
    ): Observable<{ nextcod_subagrupamento: number }> {
    
      return this.http.get<{ nextcod_subagrupamento: number }>(
        `${this.url}/next-cod`,
        {
          params: {
            cod_sistema: codSistema,
            Cod_Modulo: codModulo,
            cod_agrupamento: codAgrupamento
          }
        }
      );
    }
}
