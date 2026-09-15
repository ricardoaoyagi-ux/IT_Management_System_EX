import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JustificativaPendenciaDTO } from './pendencias.dto';
import { JustificativaMotivoDTO } from './motivos.dto';
import { JustificativaAnalistaDTO } from './analistas.dto';

@Injectable({
  providedIn: 'root'
})
export class JustificativaReportService {

    private url = 'http://localhost:3000/justificativareports'; // ajuste conforme sua rota no backend

  constructor(private http: HttpClient) {}

  /**
   * Aba 1 - Pendentes x Feitos
   */
  listarPendencias(filtro: any): Observable<JustificativaPendenciaDTO[]> {
    let params = new HttpParams()
    .set('tipo', filtro.tipo)
    .set('periodo', filtro.periodo || '');
    return this.http.get<JustificativaPendenciaDTO[]>(
      `${this.url}/pendencias`,
      { params }
    );
  }

  /**
   * Aba 2 - Principais Motivos
   */
  listarMotivos(filtro: any): Observable<JustificativaMotivoDTO[]> {
    let params = new HttpParams()
    .set('tipo', filtro.tipo)
    .set('periodo', filtro.periodo || '');
    return this.http.get<JustificativaMotivoDTO[]>(
      `${this.url}/motivos`,
      { params }
    );
  }

  /**
   * Aba 3 - Analistas Ofensores
   */
  listarAnalistas(filtro: any): Observable<JustificativaAnalistaDTO[]> {
    let params = new HttpParams()
    .set('tipo', filtro.tipo)
    .set('periodo', filtro.periodo || '');
    return this.http.get<JustificativaAnalistaDTO[]>(
      `${this.url}/analistas`,
      { params }
    );
  }

  /**
   * Helper para filtros comuns
   */
  private buildParams(filtro: any): HttpParams {
    let params = new HttpParams();

    if (filtro.periodo) {
      params = params.set('periodo', filtro.periodo);
    }

    if (filtro.dataInicio) {
      params = params.set('dataInicio', filtro.dataInicio);
    }

    if (filtro.dataFim) {
      params = params.set('dataFim', filtro.dataFim);
    }

    return params;
  }
}
