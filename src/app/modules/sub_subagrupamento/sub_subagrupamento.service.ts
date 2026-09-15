import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubSubAgrupamento } from './sub_subagrupamento.model';

@Injectable({ providedIn: 'root' })
export class SubSubAgrupamentoService {

  private url = 'http://localhost:3000/sub_subagrupamento';

  constructor(private http: HttpClient) {}

  listar(): Observable<SubSubAgrupamento[]> {
    return this.http.get<SubSubAgrupamento[]>(this.url);
  }

  criar(item: SubSubAgrupamento): Observable<any> {
    return this.http.post(this.url, item);
  }

  atualizar(id: number, item: SubSubAgrupamento): Observable<any> {
    return this.http.put(`${this.url}/${id}`, item);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  buscar(
    codSistema: number,
    codModulo: number,
    codAgrupamento: number,
    codSubAgrupamento: number
  ): Observable<SubSubAgrupamento[]> {
    return this.http.get<SubSubAgrupamento[]>(`${this.url}/buscar`, {
      params: {
        cod_sistema: codSistema ,
        Cod_Modulo: codModulo ,
        Cod_agrupamento: codAgrupamento ,
        cod_subagrupamento: codSubAgrupamento 
      }
    });
  }
  
  getNextCodSubSub(
    codSistema: number,
    codModulo: number,
    codAgrupamento: number,
    codSubAgrupamento: number
  ): Observable<{ nextcod_subsubagrupamento: number }> {
  
    return this.http.get<{ nextcod_subsubagrupamento: number }>(
      `${this.url}/next-cod`,
      {
        params: {
          cod_sistema: codSistema,
          Cod_Modulo: codModulo,
          cod_agrupamento: codAgrupamento,
          cod_subagrupamento: codSubAgrupamento
        }
      }
    );
  }
}
