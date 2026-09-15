import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipProblem } from './tip_problem.model';

@Injectable({
  providedIn: 'root'
})
export class TipProblemService {

  private url = 'http://localhost:3000/tip_problem';

  constructor(private http: HttpClient) {}

  listar(): Observable<TipProblem[]> {
    return this.http.get<TipProblem[]>(this.url);
  }

  criar(item: TipProblem): Observable<any> {
    return this.http.post(this.url, item);
  }

  atualizar(id: number, item: TipProblem): Observable<any> {
    return this.http.put(`${this.url}/${id}`, item);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
