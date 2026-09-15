import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-carga-horas',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule
  ],
  templateUrl: './candidatos.component.html'
})
export class CandidatosComponent {

  selectedFile: File | null = null;
  rows: any[] = [];

  loading = false;
  progress = 0;
  message = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.rows = [];
    this.message = '';
  }

  previewExcel() {
    if (!this.selectedFile) {
      this.message = 'Selecione um arquivo Excel.';
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);

      const workbook = XLSX.read(data, { type: 'array' });

      // 🔥 Aqui está o ponto importante
      const sheetName = 'Respuestas de formulario 1';

      if (!workbook.SheetNames.includes(sheetName)) {
        this.message = `A aba "${sheetName}" não foi encontrada no arquivo.`;
        return;
      }

      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json<any>(sheet, {
        defval: null // evita undefined
      });

      if (jsonData.length === 0) {
        this.message = 'Nenhum dado encontrado na aba.';
        return;
      }

      this.rows = jsonData;
      this.message = `${jsonData.length} registros carregados para preview.`;
    };

    reader.readAsArrayBuffer(this.selectedFile);
  }

  enviarBackend() {
    if (this.rows.length === 0) {
      this.message = 'Nenhum dado para enviar.';
      return;
    }

    this.loading = true;
    this.progress = 0;

    this.http.post('http://localhost:3000/horas/import', {
      rows: this.rows,
      fileName: this.selectedFile?.name
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.progress = 100;
        this.message = 'Importação enviada com sucesso!';
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.message = 'Erro ao enviar dados.';
      }
    });
  }
}