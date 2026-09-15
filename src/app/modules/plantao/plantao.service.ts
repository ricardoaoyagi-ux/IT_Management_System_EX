import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plantao } from './plantao.model';

@Injectable({
  providedIn: 'root'
})
export class PlantaoService {

  private url = 'http://localhost:3000/plantao';

  constructor(private http: HttpClient) {}

  listar(): Observable<Plantao[]> {
    return this.http.get<Plantao[]>(this.url);
  }

  criar(plantao: Plantao): Observable<any> {
    return this.http.post(this.url, plantao);
  }

  atualizar(id: number, plantao: Plantao): Observable<any> {
    return this.http.put(`${this.url}/${id}`, plantao);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
