import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KT } from './kt.model';

@Injectable({
  providedIn: 'root'
})
export class KTService {

  private url = 'http://localhost:3000/kt';

  constructor(private http: HttpClient) {}

  listar(): Observable<KT[]> {
    return this.http.get<KT[]>(this.url);
  }

  criar(kt: KT): Observable<any> {
    return this.http.post(this.url, kt);
  }

  atualizar(id: number, kt: KT): Observable<any> {
    return this.http.put(`${this.url}/${id}`, kt);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  listarPorStatus(status: string) {
  return this.http.get<KT[]>(
    `http://localhost:3000/kt?status=${status}`
  );
}

  getDetalhe(cod_kt: number): Observable<KT> {
    return this.http.get<KT>(`${this.url}/${cod_kt}`);
  }
}
