import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from './skills.model'; 

export interface SkillMedia {
  TRNW: number;
  OUTR: number;
  CRND: number;
  ATS: number;
  TECN: number;
  GEST: number;
}

@Injectable({
  providedIn: 'root'
})

export class SkillsService {

  private url = 'http://localhost:3000/skills';

  constructor(private http: HttpClient) {}

  listar(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.url);
  }

  criar(skill: Skill): Observable<any> {
    return this.http.post(this.url, skill);
  }

  atualizar(id: number, skill: Skill): Observable<any> {
    return this.http.put(`${this.url}/${id}`, skill);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  buscarComOrdenacao(orderByArray: string[]): Observable<Skill[]> {
    // Monta string ORDER BY para query params
    const orderString = orderByArray.join(',');
    
    const params = new HttpParams().set('orderBy', orderString);

    // Backend deve interpretar ?orderBy=skill1,skill2,skill3
    return this.http.get<Skill[]>(`${this.url}/buscar`, { params });
  }

  getMediaSkills(id: number): Observable<SkillMedia> {
    return this.http.get<SkillMedia>(`${this.url}/${id}/media`);
  }
}
