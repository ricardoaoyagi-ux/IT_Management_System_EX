import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Problem } from './problems.model';

@Injectable({
  providedIn: 'root'
})
export class ProblemsService {
  private url = 'http://localhost:3000/problems';

  constructor(private http: HttpClient) {}

  listar(): Observable<Problem[]> {
    return this.http.get<Problem[]>(this.url);
  }

  criar(problem: Partial<Problem>) {
    return this.http.post<any>(this.url, problem);
  }

  atualizar(id: number, problem: Problem): Observable<any> {
    return this.http.put(`${this.url}/${id}`, problem);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
  
  buscar(query: string): Observable<any[]> {
    return this.http.get<Problem[]>(`${this.url}/busca?query=${query}`);
  }
}
