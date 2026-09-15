import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Analista } from './analistas.model';

@Injectable({ providedIn: 'root' })
export class AnalistasService {

  private apiUrl = 'http://localhost:3000/analistas';
  apiDrop = 'http://localhost:3000/api'; // <-- ajuste conforme seu backend

  constructor(private http: HttpClient) {}

  listar(): Observable<Analista[]> {
    return this.http.get<Analista[]>(this.apiUrl);
  }

  criar(dados: Analista): Observable<any> {
    return this.http.post(this.apiUrl, dados);
  }

  atualizar(id: number, dados: Analista): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dados);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

    // Alocacao
    getAlocacao(): Observable<{ Cod_alocacao: number; Desc_alocacao: string }[]> {
      return this.http.get<{ Cod_alocacao: number; Desc_alocacao: string }[]>(
        `${this.apiDrop}/alocacao/dropdown`
      );
    }

// senioridades
getSenioridades() {
  return this.http.get<{ ID_Senioridade: number; Categoria: string; Cat: string }[]>(
    'http://localhost:3000/senioridade/dropdown'
  );
}


}
