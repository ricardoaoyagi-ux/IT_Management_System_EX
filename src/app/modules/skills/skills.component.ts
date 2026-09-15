import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { SkillsService } from './skills.service';
import { Skill } from './skills.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BaseChartDirective  } from 'ng2-charts';  
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,           // <<< adicione isto
    ReactiveFormsModule, 
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule ,
    MatProgressBarModule,  // <<< Adicione isso 
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    BaseChartDirective 
  ],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  radarData: ChartConfiguration<'radar'>['data'] = {
    labels: ['TRNW', 'OUTR', 'CRND', 'ATS', 'TECN', 'GEST'],
    datasets: [
      {
        label: 'Skills',
        data: [0, 0, 0, 0, 0, 0], // inicial vazio
        backgroundColor: 'rgba(33, 150, 243, 0.4)',
        borderColor: '#1976d2',
        pointBackgroundColor: '#0d47a1'
      }
    ]
  };
  
  radarOptions = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };
  
  lista: Skill[] = [];
  displayedColumns = ['Matricula', 'Nom_Analista', 'actions'];

  filtroNome: string = '';       // Valor digitado no input
  listaFiltrada: Skill[] = [];   // Array usado na tabela

  selectedSkill: Skill | null = null;
  form!: FormGroup;
  // Armazena as skills selecionadas nos filtros
  selectedSkills: (string | null)[] = [null, null, null];
  // Skills disponíveis para cada dropdown (filtradas)
  dropdownOptions: string[][] = [[], [], []];

  // Lista fixa de skills (ordem visual)
  camposNumericos: string[] = [
    'SistemaA','SistemaA_Cadastro','SistemaA_Sinistro','SistemaA_Cobranca','SistemaA_Emissao',
    'SistemaA_Comissao','SistemaA_Contabil','SistemaA_Cosseguro','SistemaA_Cadenas','SistemaA_SSR',
    'SistemaB','SistemaC','SistemaD_Auto','SistemaD_Auto_Front','SistemaD_Vida',
    'SistemaD_Vida_Front','SistemaD_Residencial','SistemaD_Residencial_Front','SistemaE','SistemaF',
    'BI-Cognos','SistemaG','SistemaH','Crm_salesforce','PL-SQL',
    'Webmethods','Java','Java - API','Angular','DataStage',
    'PowerCenter','Cognos','Forms','Gestao'
  ];

    // Todas as skills disponíveis
    todasSkills: string[] = [
      'SistemaA', 'SistemaA_Cadastro', 'SistemaA_Sinistro', 'SistemaA_Cobranca', 'SistemaA_Emissao',
      'SistemaA_Comissao', 'SistemaA_Contabil', 'SistemaA_Cosseguro', 'SistemaA_Cadenas', 'SistemaA_SSR',
      'SistemaB', 'SistemaC', 'SistemaD_Auto', 'SistemaD_Auto_Front', 'SistemaD_Vida', 'SistemaD_Vida_Front',
      'SistemaD_Residencial', 'SistemaD_Residencial_Front', 'SistemaE', 'SistemaF', 'BI-Cognos', 'SistemaG', 'SistemaH',
      'Crm_salesforce', 'PL-SQL', 'Webmethods', 'Java', 'Java - API', 'Angular',
      'DataStage', 'PowerCenter', 'Cognos', 'Forms', 'Gestao'
    ];

  camposOrdenados: string[] = [];

  constructor(
    private skillsService: SkillsService,
    private fb: FormBuilder
  ) {
    this.resetDropdowns();
  }
 

  ngOnInit() {
    this.carregarSkills(); 
  }

  carregarSkills() {
    this.skillsService.listar().subscribe({
      next: (data) => {
        this.lista = data;
        this.listaFiltrada = [...this.lista]; // <<< atualiza aqui, depois que os dados chegam
      },
      error: (err) => console.error('Erro ao carregar skills:', err)
    });
  }

  visualizar(skill: Skill) {
    this.selectedSkill = skill;
  
    // 🔹 1. Ordena os campos numéricos por valor (desc)
    this.camposOrdenados = [...this.camposNumericos].sort((a, b) => {
      const valorA = Number(skill[a as keyof Skill] ?? 0);
      const valorB = Number(skill[b as keyof Skill] ?? 0);
      return valorB - valorA;
    });
  
    // 🔹 2. Monta os controls do formulário
    const controls: Record<string, any> = {
      Matricula: [{ value: skill.Matricula, disabled: true }],
      Nom_Analista: [{ value: skill.Nom_Analista, disabled: true }],
      media: [{ value: skill.media, disabled: true }]
    };
  
    // 🔹 3. Usa a lista ORDENADA para criar os campos
    this.camposOrdenados.forEach(campo => {
      controls[campo] = [skill[campo as keyof Skill] ?? 1];
    });
  
    // 🔹 4. Cria o form
    this.form = this.fb.group(controls);
  
    // 🔹 5. Carrega médias do radar usando o ID do skill 
  if (skill.Id != null) {
    this.carregarMediaSkills(skill.Id);
  } else {
    console.warn('Skill sem Id, não é possível carregar médias');
  }
  }
  
  

  fecharCard() {
    this.selectedSkill = null;
  }

  getSkillKeys(skill: Skill): string[] {
    return Object.keys(skill); // retorna todas as chaves do objeto
  }
  incrementar(campo: string) {
    const valor = this.form.get(campo)?.value ?? 1;
    if (valor < 5) {
      this.form.get(campo)?.setValue(valor + 1);
    }
  }

  decrementar(campo: string) {
    const valor = this.form.get(campo)?.value ?? 1;
    if (valor > 1) {
      this.form.get(campo)?.setValue(valor - 1);
    }
  }

  salvar() {
    if (!this.selectedSkill) return;

    const payload = this.form.getRawValue();

    this.skillsService.atualizar(this.selectedSkill.Id!, payload)
      .subscribe(() => {
        this.fecharCard();
        this.carregarSkills();
      });
  }
 
  excluir() {
    if (!this.selectedSkill?.Id) {
      return;
    }
  
    const confirmacao = confirm(
      `Confirma a exclusão das skills de ${this.selectedSkill.Nom_Analista}?`
    );
  
    if (!confirmacao) {
      return;
    }
  
    this.skillsService.deletar(this.selectedSkill.Id).subscribe({
      next: () => {
        this.fecharCard();
        this.carregarSkills();
      },
      error: (err) => {
        console.error('Erro ao excluir skill:', err);
        alert('Erro ao excluir o registro.');
      }
    });
  }
  

  getSkillColor(valor: number | null): string {
    if (valor === 5) return 'warn';
    if (valor === 4) return 'orange';
    if (valor === 3) return 'yellow';
    return 'primary';
  }
  getSkillPercent(valor: number): number {
    // transforma de 1..5 em 20..100%
    return (valor / 5) * 100;
  }



  // Inicializa as opções dos dropdowns
  resetDropdowns() {
    this.dropdownOptions[0] = [...this.todasSkills];
    this.dropdownOptions[1] = [];
    this.dropdownOptions[2] = [];
  }

  // Ao selecionar um skill
  onSkillChange(index: number) {
    // Limpa os dropdowns subsequentes
    for (let i = index + 1; i < 3; i++) {
      this.selectedSkills[i] = null;
      this.dropdownOptions[i] = [];
    }

    // Atualiza o próximo dropdown
    if (index < 2 && this.selectedSkills[index]) {
      this.dropdownOptions[index + 1] = this.todasSkills.filter(
        s => !this.selectedSkills.includes(s)
      );
    }
  }

  // Dispara a busca 
  onSearch() {
    const orderBy = this.selectedSkills.filter(s => s !== null) as string[];
    if (orderBy.length === 0) return;
  
    this.displayedColumns = ['Matricula', 'Nom_Analista', ...orderBy, 'media', 'actions'];
  
    this.skillsService.buscarComOrdenacao(orderBy).subscribe(result => {
      this.lista = result.map(e => ({
        ...e,
        media: Number(e.media) || 0
      }));
      
      // Atualiza a lista filtrada também
      this.listaFiltrada = [...this.lista];
  
      // Se houver filtro no campo Nome, aplica sobre a lista nova
      if (this.filtroNome) {
        this.aplicarFiltro();
      }
    });
  }
  

  get skillColumns(): string[] {
    return this.displayedColumns.filter(col => !['Matricula','Nom_Analista','media','actions'].includes(col));
  }

  onLimpar() {
    // Limpa os valores selecionados
    this.selectedSkills = [null, null, null];
  
    // Reseta os dropdowns
    this.resetDropdowns();
  
    // Recarrega a lista original
    this.skillsService.listar().subscribe(result => {
      this.lista = result;
    });
    this.displayedColumns = ['Matricula', 'Nom_Analista', 'actions'];
    this.carregarSkills(); 
    
  this.filtroNome = '';
  this.listaFiltrada = [...this.lista];
  }

  carregarMediaSkills(id: number) {
    this.skillsService.getMediaSkills(id).subscribe(media => {
      this.radarData = {
        labels: ['TRNW', 'OUTR', 'CRND', 'ATS', 'TECN', 'GEST'],
        datasets: [
          {
            label: 'Skills',
            data: [
              media.TRNW ?? 0,
              media.OUTR ?? 0,
              media.CRND ?? 0,
              media.ATS ?? 0,
              media.TECN ?? 0,
              media.GEST ?? 0
            ],
            backgroundColor: 'rgba(33, 150, 243, 0.4)',
            borderColor: '#1976d2',
            pointBackgroundColor: '#0d47a1'
          }
        ]
      };
    });
  }
  aplicarFiltro() {
    const filtro = this.filtroNome.toLowerCase();
    this.listaFiltrada = this.lista.filter(skill =>
      (skill.Nom_Analista || '').toLowerCase().includes(filtro)
    );
  }
  onReset() {
    // Limpa os valores selecionados
  this.filtroNome = '';
  this.listaFiltrada = [...this.lista];
  }
}