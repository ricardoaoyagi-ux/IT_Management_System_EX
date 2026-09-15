import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import Papa from 'papaparse';
import { MatCardModule } from '@angular/material/card';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-carga',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatCardModule   // 👈 ADICIONAR AQUI
  ],
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css']
})
export class CargaComponent {
  selectedFile: File | null = null;
  message = '';

  slaFile: File | null = null;
reaberturaFile: File | null = null;

  total = 0;
  processed = 0;
  progress = 0;
  loading = false;

  slaLoading = false;
  slaProgress = 0;
  slaProcessed = 0;
  slaTotal = 0;
  slaMessage = '';
  
  reabLoading = false;
  reabProgress = 0;
  reabProcessed = 0;
  reabTotal = 0;
  reabMessage = '';

  usuarioLogado: string | null = null;


  constructor(private http: HttpClient) {  
}


ngOnInit() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      this.usuarioLogado = user.username;
    } catch (e) {
      console.error('Erro ao ler usuário do localStorage', e);
    }
  }
}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  private parseDateOnly(dateTime: string | null): string | null {
    if (!dateTime) return null;
  
    const datePart = dateTime.split(' ')[0]; // 07/10/25
    const [day, month, year] = datePart.split('/');
  
    // Ajuste de ano com 2 dígitos
    const fullYear = Number(year) < 50 ? `20${year}` : `19${year}`;
  
    return `${fullYear}-${month}-${day}`;
  }
  updateProgress() {
    this.progress = Math.round((this.processed / this.total) * 100);
  
    if (this.processed === this.total) {
      this.loading = false;
      this.message = `Carga concluída. ${this.total} registros processados.`;
    }
  }
  private processarCarga(rows: any[]) {

    const allIds = rows.map(r => r.Id_Incidente);
  
    this.http.post<{ newIds: string[] }>(
      'http://localhost:3000/incidente/bulk-check',
      { ids: allIds }
    ).subscribe(res => {
  
      const newRows = rows.filter(r => res.newIds.includes(r.Id_Incidente));
  
      if (newRows.length === 0) {
        this.message = 'Todos os IDs já existem. Nenhum registro inserido.';
        this.loading = false;
        return;
      }
  
      this.total = newRows.length;
      this.processed = 0;
      this.progress = 0;
      this.loading = true;
  
      newRows.forEach(row => {
        const body = {
          Id_Incidente: row.Id_Incidente,
          Sistema: null,
          Modulo: null,
          Tip_Solicitacao: null,
          Cod_Classificacao1: null,
          Cod_Classificacao2: null,
          Cod_Classificacao3: null,
          Desc_Incidente: null,
          Desc_Resolucao: null,
          Dt_Resolucao: row.Dt_Resolucao,
          Dt_Abertura: row.Dt_Abertura,
          Dt_Carga: new Date().toISOString().split('T')[0],
          Solucionador: row.Solucionador,
          RCA: false,
          Cod_RCA: null,
          St: 0
        };
  
        this.http.post<any>('http://localhost:3000/incidente', body).subscribe({
          next: () => {
            this.processed++;
            this.updateProgress();
          },
          error: err => {
            console.error(`Erro ao inserir ${row.Id_Incidente}`, err);
            this.processed++;
            this.updateProgress();
          }
        });
      });
  
      this.message = `${newRows.length} novos incidentes foram inseridos.`;
    });
  }
      

  importCSV() {
    if (!this.selectedFile) {
      this.message = 'Selecione um arquivo CSV primeiro.';
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const csvData: string = e.target.result;
  
      Papa.parse(csvData, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
        complete: (result: Papa.ParseResult<any>) => {
  
          const rows: any[] = [];
  
          result.data.forEach((row: any) => {
            const Id_Incidente = row['ID do Incidente'];
            if (!Id_Incidente) return;
  
            rows.push({
              Id_Incidente,
              Dt_Abertura: this.parseDateOnly(row['Hora da abertura']),
              Solucionador: row['Resolvido por'] || null,
              Dt_Resolucao: this.parseDateOnly(row['Cliente Resolved Time'])
            });
          });
  
          if (rows.length === 0) {
            this.message = 'Nenhum registro válido encontrado no CSV.';
            return;
          }
  
          this.processarCarga(rows);
        }
      });
    };
  
    // ✅ Esqueceu isso!
    reader.readAsText(this.selectedFile);
  }

onSlaFileSelected(event: any) {
  this.slaFile = event.target.files[0];
}

onReaberturaFileSelected(event: any) {
  this.reaberturaFile = event.target.files[0];
}

importJustificativaSLA() {
  if (!this.slaFile) {
    this.slaMessage = 'Selecione um arquivo XLSX.';
    return;
  }

  const reader = new FileReader();

  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<any>(sheet);

    // 🔍 Validação de colunas
    const requiredCols = ['cod_incidente', 'seq', 'data_resolved'];
    const fileCols = Object.keys(rows[0] || {});

    const missing = requiredCols.filter(c => !fileCols.includes(c));
    if (missing.length > 0) {
      this.slaMessage = `Colunas obrigatórias ausentes: ${missing.join(', ')}`;
      return;
    }

    this.processarCargaSlaComBulkCheck(rows);
  };

  reader.readAsArrayBuffer(this.slaFile);
}

private processarCargaSlaComBulkCheck(rows: any[]) {

  const itens = rows.map(r => ({
    cod_incidente: r.cod_incidente,
    seq: r.seq
  }));

  // 🔗 BULK-CHECK
  this.http.post<{ novos: any[] }>(
    'http://localhost:3000/justificativa-sla/bulk-check',
    { itens }
  ).subscribe(res => {

    const novos = rows.filter(r =>
      res.novos.some(n =>
        n.cod_incidente === r.cod_incidente && n.seq === r.seq
      )
    );

    if (novos.length === 0) {
      this.slaMessage = 'Todos os registros já existem. Nenhum dado inserido.';
      return;
    }

    this.slaTotal = novos.length;
    this.slaProcessed = 0;
    this.slaProgress = 0;
    this.slaLoading = true;

    novos.forEach(row => {
      const payload = {
        cod_incidente: row.cod_incidente,
        seq: row.seq,
        data_resolved: this.parseDateTime(row.data_resolved),
        obs: row.obs || null,
    usuario_upd: this.usuarioLogado,   // ✅ adiciona aqui
    data_upd: this.getCurrentDateTime() // ✅ data/hora da carga
      };

      this.http.post(
        'http://localhost:3000/justificativa-sla',
        payload
      ).subscribe({
        next: () => {
          this.slaProcessed++;
          this.updateSlaProgress();
        },
        error: err => {
          console.error('Erro SLA:', err);
          this.slaProcessed++;
          this.updateSlaProgress();
        }
      });
    });

    this.slaMessage =
      `${novos.length} registros novos encontrados. Iniciando carga...`;

  }, err => {
    console.error(err);
    this.slaMessage = 'Erro ao validar registros no bulk-check.';
  });
}


private updateSlaProgress() {
  this.slaProgress = Math.round(
    (this.slaProcessed / this.slaTotal) * 100
  );

  if (this.slaProcessed === this.slaTotal) {
    this.slaLoading = false;
    this.slaMessage = `Carga SLA concluída. ${this.slaTotal} registros processados.`;
  }
}

private parseDateTime(value: any): string | null {
  if (!value) return null;

  // 1️⃣ Se vier como número (serial do Excel)
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    if (!date) return null;

    const yyyy = date.y;
    const mm = String(date.m).padStart(2, '0');
    const dd = String(date.d).padStart(2, '0');
    const hh = String(date.H).padStart(2, '0');
    const mi = String(date.M).padStart(2, '0');
    const ss = String(Math.floor(date.S)).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  }

  // 2️⃣ Se vier como Date
  if (value instanceof Date) {
    return value.toISOString().slice(0, 19).replace('T', ' ');
  }

  // 3️⃣ Se vier como string
  if (typeof value === 'string') {
    // remove espaços duplicados
    const clean = value.replace(/\s+/g, ' ').trim();

    // 19/11/2024 09:18:00
    const [date, time] = clean.split(' ');
    if (!date || !time) return null;

    const [day, month, year] = date.split('/');

    return `${year}-${month}-${day} ${time}`;
  }

  return null;
}



importJustificativaReabertura() {
  if (!this.reaberturaFile) {
    this.reabMessage = 'Selecione um arquivo XLSX.';
    return;
  }

  const reader = new FileReader();

  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<any>(sheet);

    // 🔍 Validação de colunas
    const requiredCols = ['cod_incidente', 'seq', 'data_reabertura'];
    const fileCols = Object.keys(rows[0] || {});

    const missing = requiredCols.filter(c => !fileCols.includes(c));
    if (missing.length > 0) {
      this.reabMessage = `Colunas obrigatórias ausentes: ${missing.join(', ')}`;
      return;
    }

    this.processarCargaReabComBulkCheck(rows);
  };

  reader.readAsArrayBuffer(this.reaberturaFile);
}

private processarCargaReabComBulkCheck(rows: any[]) {

  const itens = rows.map(r => ({
    cod_incidente: r.cod_incidente,
    seq: r.seq
  }));

  // 🔗 BULK-CHECK
  this.http.post<{ novos: any[] }>(
    'http://localhost:3000/justificativa-reabertura/bulk-check',
    { itens }
  ).subscribe(res => {

    const novos = rows.filter(r =>
      res.novos.some(n =>
        n.cod_incidente === r.cod_incidente && n.seq === r.seq
      )
    );

    if (novos.length === 0) {
      this.reabMessage = 'Todos os registros já existem. Nenhum dado inserido.';
      return;
    }

    this.reabTotal = novos.length;
    this.reabProcessed = 0;
    this.reabProgress = 0;
    this.reabLoading = true;

    novos.forEach(row => {
      const payload = {
          cod_incidente: row.cod_incidente,
          seq: row.seq,
          data_reabertura: this.parseDateTime(row.data_reabertura),
          obs: row.obs || null,
          usuario_upd: this.usuarioLogado,   // ✅ adiciona aqui
          data_upd: this.getCurrentDateTime()
        };

      this.http.post(
        'http://localhost:3000/justificativa-reabertura',
        payload
      ).subscribe({
        next: () => {
          this.reabProcessed++;
          this.updateReaberturaProgress();
        },
        error: err => {
          console.error('Erro Reab:', err);
          this.reabProcessed++;
          this.updateReaberturaProgress();
        }
      });
    });

    this.reabMessage =
      `${novos.length} registros novos encontrados. Iniciando carga...`;

  }, err => {
    console.error(err);
    this.reabMessage = 'Erro ao validar registros no bulk-check.';
  });
}

 
private updateReaberturaProgress() {
  this.reabProgress = Math.round(
    (this.reabProcessed / this.reabTotal) * 100
  );

  if (this.reabProcessed === this.reabTotal) {
    this.reabLoading = false;
    this.reabMessage = `Carga Reabertura concluída. ${this.reabTotal} registros processados.`;
  }
}

private getCurrentDateTime(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}


  
}
