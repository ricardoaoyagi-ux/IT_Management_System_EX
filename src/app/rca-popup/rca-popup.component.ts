import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RcaService } from '../modules/rca/rca.service';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-rca-popup',
  standalone: true,
  templateUrl: './rca-popup.component.html',
  styleUrls: ['./rca-popup.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class RcaPopupComponent {

  private fb = inject(FormBuilder);
    private rcaService = inject(RcaService);
    public dialogRef = inject(MatDialogRef<RcaPopupComponent>);

  buscaControl = this.fb.control('');
  resultados: any[] = [];
  selectedRca: any = null;

  form: FormGroup = this.fb.group({
    Cod_RCA: [{ value: '', disabled: true }], 
    Desc_RCA: ['', Validators.required],
    Dt_Inicio: ['', Validators.required],
    Dt_Conclusao: ['', Validators.required],
    Tot_Hors_dev: ['', Validators.required] 
  });

  constructor() {
    // Observa mudanças na busca e chama API
    this.buscaControl.valueChanges.pipe(
      debounceTime(300),
      switchMap((value: string | null) => this.rcaService.buscarRCA(value ?? ''))
    ).subscribe((res: any[]) => this.resultados = res);
  }

  // Seleciona o RCA do radio button
  usarRCA() {
    if (this.selectedRca) {
      this.dialogRef.close(this.selectedRca.Cod_RCA); // envia o Código da RCA de volta
    }
  }

  adicionar() {
    if (this.form.valid) {
  
      const payload = {
        ...this.form.getRawValue() // pega tudo, inclusive disabled (se existir)
      };
  
      delete payload.Cod_RCA; // garantia extra: não enviar
  
      this.rcaService.criar(payload).subscribe({
        next: (response) => {
          // backend devolve Cod_RCA
          this.dialogRef.close(response.Cod_RCA);
        },
        error: err => console.error('Erro ao adicionar RCA:', err)
      });
  
    } else {
      console.warn('Formulário inválido');
    }
  }
  

}
