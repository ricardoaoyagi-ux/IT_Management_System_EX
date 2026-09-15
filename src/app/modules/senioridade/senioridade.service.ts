import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Senioridade } from './senioridade.model';

@Injectable({
  providedIn: 'root'
})
export class SenioridadeService {

  private url = 'http://localhost:3000/senioridade';

  constructor(private http: HttpClient) {}

  listar(): Observable<Senioridade[]> {
    return this.http.get<Senioridade[]>(this.url);
  }

  criar(senioridade: Senioridade): Observable<any> {
    return this.http.post(this.url, senioridade);
  }

  atualizar(id: number, senioridade: Senioridade): Observable<any> {
    return this.http.put(`${this.url}/${id}`, senioridade);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
