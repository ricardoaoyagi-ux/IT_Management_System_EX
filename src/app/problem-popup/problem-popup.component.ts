import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ProblemsService } from '../modules/problems/problems.service';

import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-problem-popup',
  standalone: true,
  templateUrl: './problem-popup.component.html',
  styleUrls: ['./problem-popup.component.css'],
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
export class ProblemPopupComponent {

  private fb = inject(FormBuilder);
  private ProblemsService = inject(ProblemsService);
  public dialogRef = inject(MatDialogRef<ProblemPopupComponent>);

  buscaControl = this.fb.control('');
  resultados: any[] = [];
  selectedProblem: any = null;

  form: FormGroup = this.fb.group({
    Cod_Problem: [{ value: '', disabled: true }],
    Nom_Problem: ['', Validators.required],
    Desc_Problem: ['', Validators.required],

    Tip_Problem: [null, Validators.required], // 1 ou 2
    Analista_Cadastro: [{ value: '', disabled: true }],
    Analista_Responsavel: ['']
  });

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
   
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
  
        // ajuste conforme a estrutura do seu objeto
        this.form.get('Analista_Cadastro')?.setValue(
          user.username
        );
      } catch (e) {
        console.error('Erro ao ler usuário do localStorage', e);
      }
    }
  }

  constructor() {
    // Busca com debounce
    this.buscaControl.valueChanges.pipe(
      debounceTime(300),
      switchMap((value: string | null) =>   
        this.ProblemsService.buscar(value ?? '')
      )
    ).subscribe((res: any[]) => this.resultados = res);
  }

  usarProblem() {
    if (this.selectedProblem) {
      this.dialogRef.close(this.selectedProblem.Cod_Problem);
    }
  }

  adicionar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    const raw = this.form.getRawValue();
  
    const payload = {
      Nom_Problem: raw.Nom_Problem,
      Desc_Problem: raw.Desc_Problem,
      Tip_Problem: raw.Tip_Problem,           // 1 ou 2
      Analista_Cadastro: raw.Analista_Cadastro,
      Analista_Responsavel: raw.Analista_Responsavel || null 
    };
  
    this.ProblemsService.criar(payload).subscribe({
      next: (response) => {
        this.dialogRef.close(response.Cod_Problem);
      },
      error: err => console.error('Erro ao adicionar Problem:', err)
    });
  }
  
}
