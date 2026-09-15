import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modulo } from './modulo.model';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {

  private api = 'http://localhost:3000/modulo';

  constructor(private http: HttpClient) {}

  listar(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.api);
  }

  criar(data: Modulo): Observable<any> {
    return this.http.post<any>(this.api, data);
  }

  atualizar(id: number, data: Modulo): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, data);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }
}
