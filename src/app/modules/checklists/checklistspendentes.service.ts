import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChecklistPendentes } from './checklistspendentes.model';

@Injectable({
  providedIn: 'root'
})
export class ChecklistsPendentesService {

    private url = 'http://localhost:3000/checklists'; // ajuste conforme sua rota no backend

  constructor(private http: HttpClient) {}

  listar(): Observable<ChecklistPendentes[]> {
    return this.http.get<ChecklistPendentes[]>(this.url);
  }
}
