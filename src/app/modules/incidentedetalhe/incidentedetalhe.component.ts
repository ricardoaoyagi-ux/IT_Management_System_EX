  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
  import { CommonModule } from '@angular/common';
  import { IncidenteService } from '../incidente/incidente.service';
  import { Incidente } from '../incidente/incidente.model';
  import { RouterModule, Router, ActivatedRoute } from '@angular/router';
  import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
  import { MatTableModule } from '@angular/material/table';
  import { MatButtonModule } from '@angular/material/button';
  import { MatInputModule } from '@angular/material/input';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatSelectModule } from '@angular/material/select';
  import { MatDialog } from '@angular/material/dialog';
  import { RcaPopupComponent } from '../../rca-popup/rca-popup.component';
  import { ProblemPopupComponent } from '../../problem-popup/problem-popup.component';
  import { IncProblemService } from '../inc_problem/inc_problem.service';
  import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
  import { ReplaySubject } from 'rxjs';

  @Component({
    selector: 'app-incidente-detalhe',
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      RouterModule,
      MatButtonModule,
      MatInputModule,
      MatFormFieldModule,
      MatCheckboxModule,
      MatSelectModule  ,
      NgxMatSelectSearchModule
    ],
    templateUrl: './incidentedetalhe.component.html',
    styleUrls: ['./incidentedetalhe.component.css']
  })
  export class IncidenteDetalheComponent implements OnInit {
    form: FormGroup;
    id: string = ''; 
    sistemas: { Id_aplicacao: number; nom_aplicacao: string }[] = [];
    modulos: { cod_modulo: string; nom_modulo: string }[] = [];
    agrupamentos: { cod_agrupamento: string; nom_agrupamento: string }[] = [];
    subagrupamentos: { cod_subagrupamento: string; nom_subagrupamento: string }[] = [];
    subsubagrupamentos: { cod_subsubagrupamento: string; nom_subsubagrupamento: string; }[] = [];
    popupAberto = false;
    // Filtros inteligentes para os selects
classificacao1FilterCtrl = new FormControl('');
classificacao2FilterCtrl = new FormControl('');
classificacao3FilterCtrl = new FormControl('');

// Arrays filtrados
filteredClassificacao1: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
filteredClassificacao2: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
filteredClassificacao3: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    constructor(
      private route: ActivatedRoute,
      private incProblemService: IncProblemService,
      private service: IncidenteService,
      private dialog: MatDialog,
      private fb: FormBuilder,
      private router: Router
    ) {
      this.form = this.fb.group({
        Id_Incidente: [{ value: '', disabled: true }, Validators.required],
        Sistema: ['', Validators.required],
        Modulo:  ['', Validators.required],
        Tip_Solicitacao: ['', Validators.required],
        Cod_Classificacao1: ['', Validators.required],
        Cod_Classificacao2: ['', Validators.required],
        Cod_Classificacao3: ['', Validators.required],
        Desc_Incidente: ['', Validators.required],
        Desc_Resolucao: ['', Validators.required],
        Dt_Abertura: [{ value: '', disabled: true }, Validators.required],
        Dt_Resolucao: [{ value: '', disabled: true }, Validators.required],
        Dt_Carga: [{ value: '', disabled: true }, Validators.required],
        Solucionador: [{ value: '', disabled: true }, Validators.required],
        RCA: [false],
        Cod_RCA: [{ value: '', disabled: true }],
        Cod_Problem: [{ value: '', disabled: true }], // 👈 NOVO
        St: [{ value: '', disabled: true }, Validators.required]
      });
    }

    ngOnInit() {
      this.id = this.route.snapshot.paramMap.get('id') || '';
    
      // 1️⃣ Carrega sistemas
      this.service.getSistemas().subscribe(sistemas => {
        this.sistemas = sistemas;
    
        if (!this.id) return;
    
        // 2️⃣ Carrega dados do incidente
        this.service.buscarPorId(this.id).subscribe(dados => {
          if (!dados) return;
    
          const sistemaId = dados.Sistema;
          const codModulo = dados.Modulo;
          const codAgrupamento = dados.Cod_Classificacao1;
          const codSubAgrupamento = dados.Cod_Classificacao2;
          const codSubSubAgrupamento = dados.Cod_Classificacao3;
    
          // 3️⃣ Carrega módulos
          this.service.getModulos(sistemaId).subscribe(modulos => {
            this.modulos = modulos;
    
            // 4️⃣ Carrega agrupamentos
            this.service.getAgrupamentos(sistemaId, codModulo).subscribe(agrupamentos => {
              this.agrupamentos = agrupamentos; 
               // Inicializa o filtro com todos os itens
              this.filteredClassificacao1.next(agrupamentos.slice()); // carrega toda a lista
             
               // Configura filtro inteligente
               this.classificacao1FilterCtrl.valueChanges.subscribe(() => {
                  this.filterClassificacao1();
               });
    
              // 5️⃣ Carrega subagrupamentos
              this.service.getSubAgrupamentos(sistemaId, codModulo, codAgrupamento)
                .subscribe(subs => {
                  this.subagrupamentos = subs; 
                  // Inicializa o filtro com todos os itens
                 this.filteredClassificacao2.next(subs.slice()); // carrega toda a lista
                
                  // Configura filtro inteligente
                  this.classificacao2FilterCtrl.valueChanges.subscribe(() => {
                     this.filterClassificacao2();
                  });
    
                  // 6️⃣ Carrega sub-sub-agrupamentos
                  this.service.getSubSubAgrupamentos(sistemaId, codModulo, codAgrupamento, codSubAgrupamento)
                    .subscribe((subsubs: { cod_subsubagrupamento: string; nom_subsubagrupamento: string }[]) => {
                      this.subsubagrupamentos = subsubs;
                      // Inicializa o filtro com todos os itens
                     this.filteredClassificacao3.next(subsubs.slice()); // carrega toda a lista
                    
                      // Configura filtro inteligente
                      this.classificacao3FilterCtrl.valueChanges.subscribe(() => {
                         this.filterClassificacao3();
                      });
    
                      // 7️⃣ Preenche o formulário
                      this.form.patchValue({
                        ...dados,
                        Sistema: sistemaId,
                        Modulo: Number(codModulo),
                        Cod_Classificacao1: Number(codAgrupamento),
                        Cod_Classificacao2: Number(codSubAgrupamento),
                        Cod_Classificacao3: Number(codSubSubAgrupamento),
                        Cod_Problem: dados.Cod_Problem ?? '', // 👈 AQUI
                        St: dados.St === 1 ? 'Concluído' : 'Pendente',
                        Dt_Abertura: dados.Dt_Abertura?.slice(0, 10),
                        Dt_Resolucao: dados.Dt_Resolucao?.slice(0, 10),
                        Dt_Carga: dados.Dt_Carga?.slice(0, 10),
                        RCA: dados.RCA,
                        Tip_Solicitacao: dados.Tip_Solicitacao // 👈 importante
                      }, { emitEvent: true }); // ✅ dispara valueChanges

                          // 🔹 NOVO: Buscar Cod_Problem na inc_problem
                          this.incProblemService.getByIncidente(this.id!).subscribe(incProblem => {
                            const tipSolicitacao = this.form.get('Tip_Solicitacao')?.value;
                           // console.log('GET inc_problem ->', incProblem, 'Tip_Solicitacao atual:', tipSolicitacao);
                          
                            if (tipSolicitacao !== 'Dúvida Funcional' && incProblem?.Cod_Problem) {
                              this.form.get('Cod_Problem')?.setValue(incProblem.Cod_Problem, { emitEvent: false });
                           //   console.log('Cod_Problem preenchido do banco:', incProblem.Cod_Problem);
                            }
                          });
                          
                      
                      
                       // Observa mudanças de Tip_Solicitacao
                       this.form.get('Tip_Solicitacao')?.valueChanges.subscribe(tipo => {
                       // console.log('Tip_Solicitacao mudou para:', tipo);
                      
                        if (tipo === 'Dúvida Funcional') {
                       //   console.log('Limpando Cod_Problem por Dúvida Funcional');
                          this.limparCodProblem(); 
                          this.form.get('RCA')?.setValue(false, { emitEvent: false });
                          this.form.get('Cod_RCA')?.setValue('', { emitEvent: false });
                        }
                      });



                    });
                });
            });
          });
        });
      });
        
// 8️⃣ Ajuste do popup RCA
let ignorarProximo = true;
this.form.get('RCA')?.valueChanges.subscribe(rca => {
  //console.log('RCA mudou para:', rca);
  if (ignorarProximo) {
    ignorarProximo = false;
    return;
  }

  if (rca) {
    if (!this.popupAberto) {
      this.popupAberto = true;
      const dialogRef = this.dialog.open(RcaPopupComponent, {
        width: '1000px',
        height: '700px',
        maxWidth: '95vw',
        maxHeight: '90vh'
      });

      dialogRef.afterClosed().subscribe((codRca?: string) => {
        this.popupAberto = false;

        if (codRca) {
          this.form.patchValue({ Cod_RCA: codRca }, { emitEvent: false });
          this.form.get('RCA')?.setValue(true, { emitEvent: false });

          // Se marcou RCA, limpamos o Cod_Problem
          this.limparCodProblem();
        } else {
          this.form.get('RCA')?.setValue(false, { emitEvent: false });
        }
      });
    }
  } else {
    // RCA desmarcado → limpa Cod_RCA e Cod_Problem
    //console.log('RCA desmarcado → limpando Cod_RCA e Cod_Problem');
    this.form.get('Cod_RCA')?.setValue('');
    this.limparCodProblem();
  }
});

  
    
      // 9️⃣ Observables encadeados dos selects
      this.form.get('Sistema')?.valueChanges.subscribe(sistemaId => {
        // Limpa TODOS os campos dependentes
        this.form.get('Modulo')?.reset();
        this.form.get('Cod_Classificacao1')?.reset();
        this.form.get('Cod_Classificacao2')?.reset();
        this.form.get('Cod_Classificacao3')?.reset();
      
        // Limpa listas
        this.modulos = [];
        this.agrupamentos = [];
        this.subagrupamentos = [];
        this.subsubagrupamentos = [];
        this.filteredClassificacao1.next([]); // 🔹 limpa filtro antigo
        this.filteredClassificacao2.next([]); // 🔹 limpa filtro antigo
        this.filteredClassificacao3.next([]); // 🔹 limpa filtro antigo
      
        if (!sistemaId) return;
    
        this.form.patchValue({ Cod_Classificacao1:'', Cod_Classificacao2:'', Cod_Classificacao3:'' }, { emitEvent: false });
        this.subagrupamentos = [];
        this.subsubagrupamentos = [];
    
        this.service.getModulos(sistemaId).subscribe(modulos => this.modulos = modulos);
      });
    
      this.form.get('Modulo')?.valueChanges.subscribe(codModulo => {
        const sistemaId = this.form.get('Sistema')?.value;
        // Limpa campos dependentes
        this.form.get('Cod_Classificacao1')?.reset();
        this.form.get('Cod_Classificacao2')?.reset();
        this.form.get('Cod_Classificacao3')?.reset();
      
        // Limpa listas
        this.agrupamentos = [];
        this.subagrupamentos = [];
        this.subsubagrupamentos = [];
        this.filteredClassificacao1.next([]); // 🔹 limpa filtro antigo
        this.filteredClassificacao2.next([]); // 🔹 limpa filtro antigo
        this.filteredClassificacao3.next([]); // 🔹 limpa filtro antigo

        if (!codModulo || !sistemaId) return;
    
        this.form.patchValue({ Cod_Classificacao2:'', Cod_Classificacao3:'' }, { emitEvent: false });
        this.subagrupamentos = [];
        this.subsubagrupamentos = [];
    
        this.service.getAgrupamentos(sistemaId, codModulo).subscribe(agrupamentos => {
          this.agrupamentos = agrupamentos;
        
          // 🔹 Emitir toda a lista completa imediatamente
          this.filteredClassificacao1.next(this.agrupamentos.slice());
        });

      });
    
      this.form.get('Cod_Classificacao1')?.valueChanges.subscribe(codAgrupamento => {
        const sistemaId = this.form.get('Sistema')?.value;
        const codModulo = this.form.get('Modulo')?.value;
        // Limpa campos dependentes
        this.form.get('Cod_Classificacao2')?.reset();
        this.form.get('Cod_Classificacao3')?.reset();
       
        // Limpa campos e listas imediatamente
        this.form.patchValue({ Cod_Classificacao2:'', Cod_Classificacao3:'' }, { emitEvent: false });
        this.subagrupamentos = [];
        this.subsubagrupamentos = [];
        this.filteredClassificacao2.next([]); // 🔹 limpa filtro antigo
        this.filteredClassificacao3.next([]); // 🔹 limpa filtro antigo
      
        // Só carrega subagrupamentos se houver valor válido
        if (codAgrupamento && sistemaId && codModulo) {
          this.service.getSubAgrupamentos(sistemaId, codModulo, codAgrupamento)
            .subscribe(subs => { 
              this.subagrupamentos = subs; 
              this.filteredClassificacao2.next(this.subagrupamentos.slice());
         });
        }
      });
      
      this.form.get('Cod_Classificacao2')?.valueChanges.subscribe(codSubAgrupamento => {
        const sistemaId = this.form.get('Sistema')?.value;
        const codModulo = this.form.get('Modulo')?.value;
        const codAgrupamento = this.form.get('Cod_Classificacao1')?.value;
        // Limpa campos dependentes
        this.form.get('Cod_Classificacao3')?.reset();
      
        // Limpa campo Classificação 3 e lista de subsub
        this.form.patchValue({ Cod_Classificacao3: '' }, { emitEvent: false });
        this.subsubagrupamentos = [];
        this.filteredClassificacao3.next([]); // 🔹 limpa filtro antigo
      
        // Só carrega se todos os valores anteriores existirem
        if (codSubAgrupamento && sistemaId && codModulo && codAgrupamento) {
          this.service.getSubSubAgrupamentos(sistemaId, codModulo, codAgrupamento, codSubAgrupamento)
            .subscribe(subsubs => {
              this.subsubagrupamentos = subsubs;
              this.filteredClassificacao3.next(this.subsubagrupamentos.slice());
            } );
        }
      });

 
    }
    
    private filterClassificacao1() {
      if (!this.agrupamentos) return;
    
      // pega o valor digitado
      const search = this.classificacao1FilterCtrl.value?.toLowerCase() || '';
    
      // se não digitou nada, retorna toda a lista
      if (!search) {
        this.filteredClassificacao1.next(this.agrupamentos.slice());
        return;
      }
    
      // filtra apenas se digitou algo
      this.filteredClassificacao1.next(
        this.agrupamentos.filter(a => a.nom_agrupamento.toLowerCase().includes(search))
      );
    }
    
    private filterClassificacao2() {
      if (!this.subagrupamentos) return;
    
      // pega o valor digitado
      const search = this.classificacao2FilterCtrl.value?.toLowerCase() || '';
    
      // se não digitou nada, retorna toda a lista
      if (!search) {
        this.filteredClassificacao2.next(this.subagrupamentos.slice());
        return;
      }
    
      // filtra apenas se digitou algo
      this.filteredClassificacao2.next(
        this.subagrupamentos.filter(a => a.nom_subagrupamento.toLowerCase().includes(search))
      );
    }
    
    private filterClassificacao3() {
      if (!this.subsubagrupamentos) return;
    
      // pega o valor digitado
      const search = this.classificacao3FilterCtrl.value?.toLowerCase() || '';
    
      // se não digitou nada, retorna toda a lista
      if (!search) {
        this.filteredClassificacao3.next(this.subsubagrupamentos.slice());
        return;
      }
    
      // filtra apenas se digitou algo
      this.filteredClassificacao3.next(
        this.subsubagrupamentos.filter(a => a.nom_subsubagrupamento.toLowerCase().includes(search))
      );
    }
    
    
    limparCodProblem() {
      const ctrl = this.form.get('Cod_Problem');
      if (ctrl) {
        ctrl.setValue('', { emitEvent: false }); // limpa o campo do form
      }
    }

    onRcaCheckboxChange(event: MatCheckboxChange) {
      if (event.checked && !this.popupAberto) {
        this.popupAberto = true;
        const dialogRef = this.dialog.open(RcaPopupComponent, { width: '650px' });

        dialogRef.afterClosed().subscribe((r: string) => {
          this.popupAberto = false;
          if (r) {
            this.form.patchValue({ Cod_RCA: r }, { emitEvent: false });
            this.form.get('RCA')?.setValue(true, { emitEvent: false });
          } else {
            this.form.get('RCA')?.setValue(false, { emitEvent: false });
          }
        });
      }
    }
 
    salvar() {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
    
      const raw = this.form.getRawValue();
      raw.St = raw.St === 'Concluído' ? 1 : 0;
    
      // Payload para incidente
      const payload = Object.fromEntries(
        Object.entries(raw)
              .filter(([key, v]) => key !== 'Cod_Problem' && v !== null && v !== undefined && v !== '')
      ) as Partial<Incidente>;
    
      // Valores para inc_problem
      const codProblemVal = raw.Cod_Problem; // pode ser number ou string
      const idIncidente: string = raw.Id_Incidente;
    
      const incProblemPayload = {
        Cod_Problem: codProblemVal,
        Id_Incidente: idIncidente
      };
    
      // Atualiza o incidente primeiro
      this.service.atualizar(raw.Id_Incidente, payload).subscribe(() => {
    
        // Consulta se já existe registro em inc_problem
        this.incProblemService.getByIncidente(idIncidente).subscribe(existing => {
    
          if (codProblemVal !== null && codProblemVal !== undefined && codProblemVal !== '') {
            // Se tiver Cod_Problem → cria ou atualiza
            if (existing && existing.Id) {
              this.incProblemService.atualizar(existing.Id, incProblemPayload).subscribe({
                next: () => console.log('inc_problem atualizado com sucesso'),
                error: err => console.error('Erro ao atualizar inc_problem', err)
              });
            } else {
              this.incProblemService.criar(incProblemPayload).subscribe({
                next: () => console.log('inc_problem criado com sucesso'),
                error: err => console.error('Erro ao criar inc_problem', err)
              });
            }
          } else if (existing && existing.Id) {
            // Se Cod_Problem vazio e já existe registro → deletar
            this.incProblemService.deletar(existing.Id).subscribe({
              next: () => console.log('inc_problem deletado com sucesso'),
              error: err => console.error('Erro ao deletar inc_problem', err)
            });
          } else {
            // Não há Cod_Problem e não existe registro → nada a fazer
            console.log('Nenhum Cod_Problem para salvar/deletar em inc_problem, pulando...');
          }
    
        });
    
        alert('Incidente atualizado com sucesso!');
        this.router.navigate(['/app/incidente']);
      });
    }
    
    
      
    

    voltar() {
      this.router.navigate(['/app/incidente']);
    }

    shouldShowCodProblem(): boolean {
      const tipo = this.form.get('Tip_Solicitacao')?.value;
      const rca = this.form.get('RCA')?.value;
    
      const tiposValidos = [
        'Erro de Dados',
        'Erro Sistêmico',
        'Performance'
      ];
    
      return tiposValidos.includes(tipo) && !rca;
    }
openProblemPopup() {
  const dialogRef = this.dialog.open(ProblemPopupComponent, {
    width: '900px',
    height: '600px',
    maxWidth: '95vw',
    maxHeight: '90vh'
  });

  dialogRef.afterClosed().subscribe((codProblem?: string) => {
    if (codProblem) {
      this.form.patchValue(
        { Cod_Problem: codProblem },
        { emitEvent: false }
      );
    }
  });
}

canSave(): boolean {
  if (this.form.invalid) return false;

  const tipo = this.form.get('Tip_Solicitacao')?.value;
  const rcaMarcado = this.form.get('RCA')?.value;
  const codRca = this.form.get('Cod_RCA')?.value;
  const codProblem = this.form.get('Cod_Problem')?.value;

  // Cenário Dúvida Funcional: apenas form válido já basta
  if (tipo === 'Dúvida Funcional') return true;

  // Cenário Erro de Dados, Erro Sistêmico, Performance
  const tiposQueExigemValidacao = ['Erro de Dados', 'Erro Sistêmico', 'Performance'];
  if (tiposQueExigemValidacao.includes(tipo)) {
    // Habilita somente se:
    // 1️⃣ RCA marcado e possui código
    // 2️⃣ OU Cod_Problem preenchido
    if ((rcaMarcado && codRca) || codProblem) return true;
    return false;
  }

  // Para qualquer outro caso, apenas form válido
  return true;
}


  }
