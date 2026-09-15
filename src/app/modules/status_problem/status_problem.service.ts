import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatusProblem } from './status_problem.model';

@Injectable({
  providedIn: 'root'
})
export class StatusProblemService {

  private url = 'http://localhost:3000/status_problem';

  constructor(private http: HttpClient) {}

  listar(): Observable<StatusProblem[]> {
    return this.http.get<StatusProblem[]>(this.url);
  }

  criar(status: StatusProblem): Observable<any> {
    return this.http.post(this.url, status);
  }

  atualizar(id: number, status: StatusProblem): Observable<any> {
    return this.http.put(`${this.url}/${id}`, status);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
