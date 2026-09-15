import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProblemReport } from './problemreport.model';

@Injectable({
  providedIn: 'root'
})
export class ProblemReportService {

    private url = 'http://localhost:3000/problemreports'; // ajuste conforme sua rota no backend

  constructor(private http: HttpClient) {}

  listar(filtros: any): Observable<ProblemReport[]> {
    let params = new HttpParams();

    Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });

    return this.http.get<ProblemReport[]>(this.url, { params });
  }
}
