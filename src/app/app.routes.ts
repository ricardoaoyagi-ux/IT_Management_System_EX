import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './guards/role.guard';

import { MainLayoutComponent } from './modules/layouts/main_layout.component';

import { LoginComponent } from './modules/user/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

import { AgrupamentoComponent } from './modules/agrupamento/agrupamento.component';
import { AlocacaoComponent } from './modules/alocacao/alocacao.component';
import { AnalistasComponent } from './modules/analistas/analistas.component';
import { AplicacoesComponent } from './modules/aplicacoes/aplicacoes.component';
import { FeriasComponent } from './modules/ferias/ferias.component';
import { IncProblemComponent } from './modules/inc_problem/inc_problem.component';
import { IncidenteComponent } from './modules/incidente/incidente.component';
import { IncidenteDetalheComponent } from './modules/incidentedetalhe/incidentedetalhe.component';
import { ModuloComponent } from './modules/modulo/modulo.component';
import { ProblemsComponent } from './modules/problems/problems.component';
import { RatesComponent } from './modules/rates/rates.component';
import { RcaComponent } from './modules/rca/rca.component';
import { SenioridadeComponent } from './modules/senioridade/senioridade.component';
import { SistemaComponent } from './modules/sistema/sistema.component';
import { SkillsComponent } from './modules/skills/skills.component';
import { StatusProblemComponent } from './modules/status_problem/status_problem.component';
import { SubAgrupamentoComponent } from './modules/sub_agrupamento/sub_agrupamento.component';
import { SubSubAgrupamentoComponent } from './modules/sub_subagrupamento/sub_subagrupamento.component';
import { TipProblemComponent } from './modules/tip_problem/tip_problem.component';
import { CargaComponent } from './modules/carga/carga.component';
import { UserComponent } from './modules/user/user.component';
import { ChecklistsPendentesComponent } from './modules/checklists/checklistspendentes.component';
import { ProblemReportComponent } from './modules/reports/problemreport.component';
import { PlantaoComponent } from './modules/plantao/plantao.component';
import { JustificativaSlaPageComponent } from './modules/justificativa/justificativa-sla-page.component';
import { JustificativaReaberturaPageComponent } from './modules/justificativa/justificativa-reabertura-page.component';
import { MotivoJustificativaComponent } from './modules/motivo/motivo-justificativa.component';
import { JustificativaReportComponent } from './modules/reports/justificativareport.component';
import { KTComponent } from './modules/kts/kt.component';

import { TimeboxComponent } from './modules/timebox/timebox.component';
import { CapacityPlannerComponent } from './modules/capacityplanner/capacityplanner.component';

import { MfaSetupComponent } from './modules/user/mfa-setup.component';
import { MfaVerifyComponent } from './modules/user/mfa-verify.component';

import { CargaHorasComponent } from './modules/rh/carga-horas.component';
import { CandidatosComponent } from './modules/rh/candidatos.component';
import { CalendarioHorasComponent } from './modules/rh/validador-horas.component';

export const routes: Routes = [

  // 🔐 LOGIN
  { path: '', component: LoginComponent },

  { path: 'mfa/setup', component: MfaSetupComponent, canActivate: [AuthGuard] },
  { path: 'mfa/verify', component: MfaVerifyComponent, canActivate: [AuthGuard] },
  // 🏠 SISTEMA
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [

      // Dashboard → todos logados
      { path: 'dashboard', component: DashboardComponent },

      // ===== Sustain =====
      {
        path: 'incidente',
        component: IncidenteComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 2, 4] }
      },
      {
        path: 'incidente/:id',
        component: IncidenteDetalheComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 2, 4] }
      },
      {
        path: 'problems',
        component: ProblemsComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 2, 4] }
      },
      {
        path: 'rca',
        component: RcaComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 2, 4] }
      },
      {
        path: 'justificativa-sla',
        component: JustificativaSlaPageComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 2, 4] }
      },
      {
        path: 'justificativa-reabertura',
        component: JustificativaReaberturaPageComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 2, 4] }
      },
      

      // ===== Cadastros =====
      {
        path: 'modulo',
        component: ModuloComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'agrupamento',
        component: AgrupamentoComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'aplicacoes',
        component: AplicacoesComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'sub_agrupamento',
        component: SubAgrupamentoComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'sub_subagrupamento',
        component: SubSubAgrupamentoComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'sistema',
        component: SistemaComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },

      // ===== Gestão =====
      {
        path: 'analistas',
        component: AnalistasComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 2] }
      },
      {
        path: 'ferias',
        component: FeriasComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 2] }
      },
      {
        path: 'plantao',
        component: PlantaoComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 2] }
      },
      {
        path: 'skills',
        component: SkillsComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 2] }
      },
      {
        path: 'kt',
        component: KTComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 2] }
      },
      {
        path: 'timebox',
        component: TimeboxComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 2] }
      },
      {
        path: 'calendario',
        component: CapacityPlannerComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 2] }
      },


      // ===== Interna =====
      {
        path: 'senioridade',
        component: SenioridadeComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'rates',
        component: RatesComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'alocacao',
        component: AlocacaoComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'inc_problem',
        component: IncProblemComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'motivo-justificativa',
        component: MotivoJustificativaComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'status_problem',
        component: StatusProblemComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'tip_problem',
        component: TipProblemComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'carga',
        component: CargaComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1, 3] }
      },
      {
        path: 'user',
        component: UserComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'checklists',
        component: ChecklistsPendentesComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'problemreports',
        component: ProblemReportComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },
      {
        path: 'justificativareports',
        component: JustificativaReportComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1] }
      },

      
      // ===== RH =====
      {
        path: 'carga-horas',
        component: CargaHorasComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1,6] }
      },
      {
        path: 'validador-horas',
        component: CalendarioHorasComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1,6] }
      },

      
      {
        path: 'candidatos',
        component: CandidatosComponent,
        canActivate: [RoleGuard],
        data: { perfis: [1,6] }
      },

      // rota padrão do módulo
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // fallback
  { path: '**', redirectTo: '' }
];
