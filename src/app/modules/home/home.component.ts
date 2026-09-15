import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatListModule],
  template: `
    <div class="home-wrapper">
      <h1 class="title">SIG v3.0</h1>

      <mat-card>
        <div class="grid-container">
          <div class="group-column">
            <h3 class="group-title">Sustain</h3>
            <mat-nav-list>
              <a mat-list-item [routerLink]="'/incidente'">Incidente</a>
              <a mat-list-item [routerLink]="'/problems'">Problems</a>
              <a mat-list-item [routerLink]="'/rca'">RCA</a>
            </mat-nav-list>
          </div>

          <div class="group-column">
            <h3 class="group-title">Cadastros</h3>
            <mat-nav-list>
              <a mat-list-item [routerLink]="'/agrupamento'">Agrupamento</a>
              <a mat-list-item [routerLink]="'/aplicacoes'">Aplicacoes</a>
              <a mat-list-item [routerLink]="'/modulo'">Modulo</a>
              <a mat-list-item [routerLink]="'/sub_agrupamento'">Sub_Agrupamento</a>
              <a mat-list-item [routerLink]="'/sistema'">Sistema</a>
            </mat-nav-list>
          </div>

          <div class="group-column">
            <h3 class="group-title">Gestao</h3>
            <mat-nav-list>
              <a mat-list-item [routerLink]="'/analistas'">Analistas</a>
              <a mat-list-item [routerLink]="'/ferias'">Férias</a>
              <a mat-list-item [routerLink]="'/skills'">Skills</a>
              <a mat-list-item [routerLink]="'/rates'">Rates</a>
            </mat-nav-list>
          </div>

          <div class="group-column">
            <h3 class="group-title">Interna</h3>
            <mat-nav-list>
              <a mat-list-item [routerLink]="'/alocacao'">Alocação</a>
              <a mat-list-item [routerLink]="'/inc_problem'">Inc_Problem</a>
              <a mat-list-item [routerLink]="'/status_problem'">Status_problem</a>
              <a mat-list-item [routerLink]="'/tip_problem'">Tip_problem</a>
            </mat-nav-list>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .home-wrapper {
      max-width: 900px;
      margin: 50px auto;
      text-align: center;
    }
    .title {
      margin-bottom: 30px;
      font-weight: 700;
      font-size: 2.5rem;
      color: #1976d2;
    }
    mat-card {
      padding: 20px;
    }
    .grid-container {
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }
    .group-column {
      flex: 1;
      text-align: left;
    }
    .group-title {
      font-weight: 800;
      font-size: 1.2rem;
      margin-bottom: 10px;
      color: #333;
    }
    a.mat-list-item {
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
    }
  `]
})
export class HomeComponent {}
