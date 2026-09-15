import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rate } from './rates.model';

@Injectable({
  providedIn: 'root'
})
export class RatesService {

  private url = 'http://localhost:3000/rates';

  constructor(private http: HttpClient) {}

  listar(): Observable<Rate[]> {
    return this.http.get<Rate[]>(this.url);
  }

  criar(rate: Rate): Observable<any> {
    return this.http.post(this.url, rate);
  }

  atualizar(id: number, rate: Rate): Observable<any> {
    return this.http.put(`${this.url}/${id}`, rate);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
