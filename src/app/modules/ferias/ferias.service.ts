import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ferias } from './ferias.model';

@Injectable({
  providedIn: 'root'
})
export class FeriasService {
  private baseUrl = 'http://localhost:3000/ferias';

  constructor(private http: HttpClient) {}

  listar(): Observable<Ferias[]> {
    return this.http.get<Ferias[]>(this.baseUrl);
  }

  criar(ferias: Ferias): Observable<any> {
    return this.http.post(this.baseUrl, ferias);
  }

  atualizar(id: number, ferias: Ferias): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, ferias);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  buscar(filtro: any): Observable<Ferias[]> {
    const params = new URLSearchParams();
  
    if (filtro.Nom_Analista) params.set('Nom_Analista', filtro.Nom_Analista);
    if (filtro.Dt_Inicio) params.set('Dt_Inicio', filtro.Dt_Inicio);
    if (filtro.Pendente !== '') params.set('Pendente', filtro.Pendente);
  
    return this.http.get<Ferias[]>(`${this.baseUrl}/buscar?${params.toString()}`);
  }

  getAnalistaPorMatricula(matricula: number): Observable<{ Nom_Analista: string }> {
    return this.http.get<{ Nom_Analista: string }>(
      `${this.baseUrl}/matricula/${matricula}`
    );
  }

  listarAnalistas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/analistas`);
  }
}
