import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendario-horas',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatButtonModule, MatCardModule, FormsModule],
  templateUrl: './validador-horas.component.html',
  styleUrls: ['./validador-horas.component.css']
})
export class CalendarioHorasComponent {

  Object = Object; 
  diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  usuarios: any[] = [];
  periodos: string[] = [];
  usuarioSelecionado = '';
  periodoSelecionado = '';
  eventosPorDia: Record<string, any[]> = {};

  diasMes: string[] = []; // lista completa dos dias do mês
  diasMesComEspacos: string[] = []; // lista com espaços para alinhar

  constructor(private http: HttpClient) {
    const hoje = new Date();
    for (let y = 2026; y <= hoje.getFullYear(); y++) {
      const mesInicio = y === 2026 ? 1 : 1;
      const mesFim = y === hoje.getFullYear() ? hoje.getMonth() + 1 : 12;
      for (let m = mesInicio; m <= mesFim; m++) {
        this.periodos.push(`${String(m).padStart(2,'0')}/${y}`);
      }
    }
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.http.get<any[]>('http://localhost:3000/horas/usuarios')
      .subscribe(u => this.usuarios = u);
  }

  aplicarFiltro() {
    if (!this.usuarioSelecionado || !this.periodoSelecionado) return;

    const [mesStr, anoStr] = this.periodoSelecionado.split('/');
    const ano = parseInt(anoStr, 10);
    const mes = parseInt(mesStr, 10);

    this.diasMes = this.gerarDiasMes(ano, mes);
    this.diasMesComEspacos = this.gerarDiasComEspacos(ano, mes);

    this.http.get<Record<string, any[]>>(
      `http://localhost:3000/horas/calendario?usuario=${this.usuarioSelecionado}&ano=${ano}&mes=${mes}`
    ).subscribe(res => this.eventosPorDia = res);
  }

  gerarDiasMes(ano: number, mes: number): string[] {
    const dias: string[] = [];
    const totalDias = new Date(ano, mes, 0).getDate();
    for (let d = 1; d <= totalDias; d++) {
      dias.push(`${ano}-${String(mes).padStart(2,'0')}-${String(d).padStart(2,'0')}`);
    }
    return dias;
  }

  gerarDiasComEspacos(ano: number, mes: number): string[] {
    const dias = this.gerarDiasMes(ano, mes);
    const primeiroDia = this.getDayOfWeek(dias[0]); // 0=domingo
    const espacos: string[] = [];
    for (let i = 0; i < primeiroDia; i++) espacos.push('');
    return [...espacos, ...dias];
  }

  getEventosDia(dia: string) {
    return this.eventosPorDia[dia] || [];
  }

  getDayOfWeek(dateStr: string): number {
    const [ano, mes, dia] = dateStr.split('-').map(Number);
    const date = new Date(ano, mes - 1, dia);
    return date.getDay(); // domingo = 0
  }

  // Retorna o ícone e a cor do status_validacao
getCorEvento(ev: any): string {

  // 🔥 PRIORIDADE: tipo do evento
  if (ev.tipo === 'Pausa') return '#e0e0e0'; // cinza
  if (ev.tipo === 'StandBy') return '#bbdefb'; // azul leve
  if (ev.tipo === 'Hora Extra') return '#ffe082'; // amarelo

  // 🔹 fallback: status
  switch (ev.status_validacao) {
    case 'validado': return '#b2fab4';
    case 'pendente': return '#fff3b0';
    case 'recusou': return '#f8b4b4';
    default: return '#eeeeee';
  }
}
getStatusIcon(ev: any): {icone: string, cor: string} {
  switch(ev.status_validacao) {
    case 'validado': return {icone: '✅', cor: '#b2fab4'}; // verde suave
    case 'pendente': return {icone: '⚠️', cor: '#fff3b0'}; // amarelo suave
    case 'recusou': return {icone: '❌', cor: '#f8b4b4'}; // vermelho suave
    default: return {icone: '', cor: '#eeeeee'}; // cinza neutro
  }
}

eventosConflitam(ev1: any, ev2: any): boolean {
  return !(ev1.fim <= ev2.inicio || ev1.inicio >= ev2.fim);
}

organizarEventos(dia: string) {
  const eventos = [...(this.eventosPorDia[dia] || [])];

  const grupos: any[] = [];

  eventos.forEach(ev => {
    let colocado = false;

    for (const grupo of grupos) {
      if (grupo.some((e: any) => this.eventosConflitam(e, ev))) {
        grupo.push(ev);
        colocado = true;
        break;
      }
    }

    if (!colocado) {
      grupos.push([ev]);
    }
  });

  return grupos;
}

}