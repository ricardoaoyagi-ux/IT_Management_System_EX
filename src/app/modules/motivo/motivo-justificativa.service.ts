import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MotivoJustificativa } from './motivo-justificativa.model';

@Injectable({
  providedIn: 'root'
})
export class MotivoJustificativaService {

  private url = 'http://localhost:3000/motivo-justificativa';

  constructor(private http: HttpClient) {}

  listar(): Observable<MotivoJustificativa[]> {
    return this.http.get<MotivoJustificativa[]>(this.url);
  }

  criar(motivo: MotivoJustificativa): Observable<any> {
    return this.http.post(this.url, motivo);
  }

  atualizar(id: number, motivo: MotivoJustificativa): Observable<any> {
    return this.http.put(`${this.url}/${id}`, motivo);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
