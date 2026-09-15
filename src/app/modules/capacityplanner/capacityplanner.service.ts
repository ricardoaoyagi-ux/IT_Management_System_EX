import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AnalistaDTO,
  TimeboxProjetoDTO,
  FeriadoDTO,
  FeriasDTO,
  ParticipacaoDTO
} from './capacityplanner.model';

@Injectable({
  providedIn: 'root'
})
export class CapacityPlannerService {
  private baseUrl = 'http://localhost:3000/capacityplanner';

  constructor(private http: HttpClient) {}

  getAnalistas() {
    return this.http.get<AnalistaDTO[]>(`${this.baseUrl}/analistas`);
  }

  getParticipacoes(): Observable<ParticipacaoDTO[]> {
  return this.http.get<ParticipacaoDTO[]>(
    `${this.baseUrl}/participacoes`
  );
}

getProjetos(): Observable<TimeboxProjetoDTO[]> {
  return this.http.get<TimeboxProjetoDTO[]>(`${this.baseUrl}/timebox-projeto`);
}


  getFeriados() {
    return this.http.get<FeriadoDTO[]>(`${this.baseUrl}/feriados`);
  }

  getFerias() {
    return this.http.get<FeriasDTO[]>(`${this.baseUrl}/ferias`);
  }

}
