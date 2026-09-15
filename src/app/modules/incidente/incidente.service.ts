import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incidente } from './incidente.model';

@Injectable({
  providedIn: 'root'
})
export class IncidenteService {
  apiUrl = 'http://localhost:3000/incidente'; // <-- ajuste conforme seu backend
  apiDrop = 'http://localhost:3000/api'; // <-- ajuste conforme seu backend

  constructor(private http: HttpClient) {}

  listar(): Observable<Incidente[]> {
    return this.http.get<Incidente[]>(this.apiUrl);
  }

  buscarPorId(id: string): Observable<Incidente> {
    return this.http.get<Incidente>(`${this.apiUrl}/${id}`);
  }

  criar(incidente: Incidente) {
    return this.http.post(this.apiUrl, incidente);
  }

  atualizar(id: string, incidente: Partial<Incidente>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, incidente);
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  listarMeus(username: string) {
    return this.http.get<Incidente[]>(`${this.apiUrl}/meus/${username}`);
  }

  // Sistema
getSistemas(): Observable<{Id_aplicacao:number, nom_aplicacao:string}[]> {
  return this.http.get<any[]>(`${this.apiDrop}/sistema/dropdown`);
}

// Modulo
getModulos(sistemaId: number): Observable<{cod_modulo:string, nom_modulo:string}[]> {
  return this.http.get<any[]>(`${this.apiDrop}/modulo/dropdown/${sistemaId}`);
}

// Classificação 1 (agrupamento)
getAgrupamentos(sistemaId: number, codModulo: string): Observable<{cod_agrupamento:string, nom_agrupamento:string}[]> {
  return this.http.get<any[]>(`${this.apiDrop}/agrupamento/dropdown/${sistemaId}/${codModulo}`);
}

// Classificação 2 (subagrupamento)
getSubAgrupamentos(sistemaId: number, codModulo: string, codAgrupamento: string): Observable<{cod_subagrupamento:string, nom_subagrupamento:string}[]> {
  return this.http.get<any[]>(`${this.apiDrop}/sub_agrupamento/dropdown/${sistemaId}/${codModulo}/${codAgrupamento}`);
}

// Classificação 3 (sub-sub-agrupamento)
getSubSubAgrupamentos(  sistemaId: number,  codModulo: string,  codAgrupamento: string,  codSubAgrupamento: string): Observable<{ cod_subsubagrupamento: string; nom_subsubagrupamento: string }[]> {
  return this.http.get<any[]>(`${this.apiDrop}/sub_subagrupamento/dropdown/${sistemaId}/${codModulo}/${codAgrupamento}/${codSubAgrupamento}`);
}

}
