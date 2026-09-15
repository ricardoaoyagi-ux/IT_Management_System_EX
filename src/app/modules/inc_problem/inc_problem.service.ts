import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncProblem } from './inc_problem.model';

@Injectable({
  providedIn: 'root'
})
export class IncProblemService {
  private baseUrl = 'http://localhost:3000/inc_problem';

  constructor(private http: HttpClient) {}

  listar(): Observable<IncProblem[]> {
    return this.http.get<IncProblem[]>(this.baseUrl);
  }

  criar(incProblem: IncProblem): Observable<any> {
    return this.http.post(this.baseUrl, incProblem);
  }

  atualizar(id: number, incProblem: IncProblem): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, incProblem);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getByIncidente(idIncidente: string): Observable<IncProblem | null> {
    return this.http.get<IncProblem | null>(`${this.baseUrl}/by-incidente/${idIncidente}`);
  }

  
}
