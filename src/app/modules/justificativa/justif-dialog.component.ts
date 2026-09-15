import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JustificativaBaseService } from './justificativa.service';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { HttpClient } from '@angular/common/http';

interface MotivoJustificativa {
  cod_motivo: number;
  descricao: string;
  abono: string;
  tipo_motivo: string;
}

@Component({
  selector: 'app-justificativa-dialog',
  standalone: true,
  templateUrl: './justif-dialog.component.html',
  styleUrls: ['./justif-dialog.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class JustificativaDialogComponent {

  obs = '';
  motivoId: number | null = null;
  motivos: MotivoJustificativa[] = [];

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<JustificativaDialogComponent>, // ✅ FALTAVA ISSO
    @Inject(MAT_DIALOG_DATA) public data: {
      cod_incidente: string;
      Solucionador: string;
      data: string;
      obs?: string;
      motivo_id?: number;
      titulo: string; // ✅
      service: JustificativaBaseService;
    }
  ) {
    this.obs = data.obs || '';
    this.motivoId = data.motivo_id ?? null;
  }

  ngOnInit() {
    this.carregarMotivos();
  }

  carregarMotivos() {
    console.log(this.data.titulo);
    const tipo = this.data.titulo.includes('Justificativa de SLA') ? 'SLA' : 'REABERTURA';
  
    // Use template literal com crase
    this.http.get<MotivoJustificativa[]>(`http://localhost:3000/motivo-justificativa?tipo=${tipo}`)
      .subscribe(dados => {
        this.motivos = dados;
      });
  }

  salvar() {
    this.data.service
      .atualizarObs(
        this.data.cod_incidente,
        this.obs,
        this.motivoId
      )
      .subscribe(() => this.dialogRef.close(true));
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
