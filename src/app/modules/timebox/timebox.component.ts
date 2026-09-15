import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TimeboxService } from './timebox.service';
import { TimeboxContrato, TimeboxProjeto, TimeboxProjetoParticipacao } from './timebox.model';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatDialog } from '@angular/material/dialog';
import { ContratoDialogComponent } from './contrato-dialog.component';
import { ProjetoDialogComponent } from './projeto-dialog.component';
import { MembroDialogComponent } from './membro-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';
 


@Component({
  selector: 'app-timebox',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule
  ],
  template: `
<div class="container">
  <!-- Cabeçalho do Timebox -->
  <div class="timebox-header">
    <h2>Timebox</h2>
    <button mat-raised-button color="primary" (click)="novoContrato()">Adicionar Contrato</button>
  </div>

  <mat-accordion multi>
    <!-- Loop de Contratos -->
    <mat-expansion-panel *ngFor="let contrato of contratos" class="contrato-panel">
      <mat-expansion-panel-header>
        <div class="header-content">
          <div class="descricao">{{ contrato.Descricao }}</div>
          <div class="info-extra">
            Horas Contratadas: {{ contrato.HorasContratadas }} |
            Horas Consumidas : {{ contrato.HorasConsumidas  }} |
            Início: {{ formatDate(contrato.DataInicio) }} |
            Fim: {{ formatDate(contrato.DataFim) }}
          </div>
        </div>
      </mat-expansion-panel-header>

      <!-- Ações do Contrato -->
      <div class="acoes-contrato">
        <button mat-button color="accent" (click)="editarContrato(contrato)">Editar</button>
        <button mat-button color="warn" (click)="removerContrato(contrato.Id)">Remover</button>
        <button mat-button color="primary" (click)="novoProjeto(contrato)">Novo Projeto</button>
      </div>

      <!-- Projetos do Contrato -->
      <div class="projetos-container">
        <mat-accordion multi>
          <mat-expansion-panel *ngFor="let projeto of contrato.Projetos" class="projeto-panel">
            <mat-expansion-panel-header>
              <div class="header-content">
                <div class="descricao">{{ projeto.Nome }}</div>
                <div class="info-extra">
                  Horas Contratadas : {{  projeto.HorasPrevistas  }} |
                  Horas Consumidas  : {{  projeto.HorasConsumidas }} |
                  Início: {{ formatDate(projeto.DataInicio) }} |
                  Previsão fim: {{ formatDate(projeto.DataPrevisaoFim) }} |
                  Fim real: {{ projeto.DataFimReal ? formatDate(projeto.DataFimReal) : '-' }} |
                  Status: {{ projeto.Status }}
                </div>
              </div>
            </mat-expansion-panel-header>

            <div class="acoes-projeto">
              <button mat-button color="accent" (click)="editarProjeto(projeto)">Editar</button>
              <button mat-button color="warn" (click)="removerProjeto(projeto.Id!)">Remover</button>
              <button mat-button color="primary" (click)="vincularMembro(projeto)">Vincular Membro</button>
            </div>

            <!-- Membros do Projeto -->
            <table mat-table [dataSource]="projeto.Participacoes ?? []" class="mat-elevation-z8">
              <ng-container matColumnDef="Nome">
                <th mat-header-cell *matHeaderCellDef> Nome </th>
                <td mat-cell *matCellDef="let m"> {{ m.Nome }} </td>
              </ng-container>

              <ng-container matColumnDef="Papel">
                <th mat-header-cell *matHeaderCellDef> Papel </th>
                <td mat-cell *matCellDef="let m"> {{ m.Papel }} </td>
              </ng-container>

<ng-container matColumnDef="Periodo">
  <th mat-header-cell *matHeaderCellDef> Período </th>
  <td mat-cell *matCellDef="let p">
    {{ formatDate(p.DataInicio) }} → {{ formatDate(p.DataFim) }}
  </td>
</ng-container>

<ng-container matColumnDef="HorasPorDia">
  <th mat-header-cell *matHeaderCellDef> Horas/Dia </th>
  <td mat-cell *matCellDef="let p"> {{ p.HorasPorDia }} </td>
</ng-container>

              <ng-container matColumnDef="acoes">
                <th mat-header-cell *matHeaderCellDef> Ações </th>
                <td mat-cell *matCellDef="let m">
                  <button mat-button color="accent" (click)="editarMembro(m)">Editar</button>
                  <button mat-button color="warn" (click)="removerMembro(m.Id)">Remover</button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="['Nome','Papel','Periodo','HorasPorDia','acoes']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['Nome','Papel','Periodo','HorasPorDia','acoes']"></tr>
            </table>
          </mat-expansion-panel>
        </mat-accordion>
      </div>

    </mat-expansion-panel>
  </mat-accordion>
</div>

  `,
  styles: [`
    .container { padding: 20px; padding-top: 60px; } 
    table { width: 100%; margin-top: 10px; }

.timebox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.contrato-panel {
  margin-bottom: 15px; /* Espaço entre contratos */
}

.projeto-panel {
  margin-bottom: 10px; /* Espaço entre projetos */
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px; /* espaçamento entre o nome e a info extra */
}
.descricao {
  font-weight: bold;
}
.info-extra {
  color: #555; /* opcional, para diferenciar do nome */
  font-size: 0.9em;
}

.acoes-contrato, .acoes-projeto {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.projetos-container {
  margin-left: 20px;
}
  `]
})
export class TimeboxComponent implements OnInit {

  contratos: TimeboxContrato[] = [];

  constructor(private timeboxService: TimeboxService, 
              private fb: FormBuilder, 
              private dialog: MatDialog) {}

  ngOnInit() {
    this.carregarContratos();
  }

carregarContratos() {
  this.timeboxService.listarContratos().subscribe(dados => {
        console.log('Dados brutos do backend:', dados); // ✅ veja o que realmente veio

    this.contratos = dados.map(c => ({
      ...c,
      Projetos: c.Projetos?.map(p => ({
        ...p,
        Participacoes: (p as any).Membros ?? [] // 👈 usa o que o backend mandou
      })) ?? []
    }));
  });
}

  // Contrato
novoContrato() {
  const dialogRef = this.dialog.open(ContratoDialogComponent, {
    width: '400px',
    data: null // porque é novo contrato
  });

  dialogRef.afterClosed().subscribe((resultado: TimeboxContrato | undefined) => {
    if (resultado) {
      // chama service para criar
      this.timeboxService.criarContrato(resultado).subscribe(() => this.carregarContratos());
    }
  });
}

editarContrato(c: TimeboxContrato) {
  const dialogRef = this.dialog.open(ContratoDialogComponent, {
    width: '400px',
    data: c
  });

  dialogRef.afterClosed().subscribe((resultado: TimeboxContrato | undefined) => {
    if (resultado) {
      this.timeboxService.atualizarContrato(c.Id, resultado)
        .subscribe(() => this.carregarContratos());
    }
  });
}

removerContrato(id: number) {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: { message: 'Tem certeza que deseja remover este contrato?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.timeboxService.deletarContrato(id).subscribe(() => {
        this.contratos = this.contratos.filter(c => c.Id !== id);
      });
    }
  });
}

  // Projeto
novoProjeto(contrato: TimeboxContrato) {
  const dialogRef = this.dialog.open(ProjetoDialogComponent, { data: { TimeboxContratoId: contrato.Id } });

  dialogRef.afterClosed().subscribe((projeto: TimeboxProjeto) => {
    if (projeto) {
      // Chamada ao backend para criar o projeto
      this.timeboxService.criarProjeto(projeto).subscribe(res => {
        // Atualizar a lista de contratos/projetos
        this.carregarContratos();
      });
    }
  });
}

editarProjeto(projeto: TimeboxProjeto) {
  const dialogRef = this.dialog.open(ProjetoDialogComponent, { data: projeto });

  dialogRef.afterClosed().subscribe((projetoEditado: TimeboxProjeto) => {
    if (projetoEditado) {
      // Chamada ao backend para atualizar o projeto
      this.timeboxService.atualizarProjeto(projetoEditado.Id!, projetoEditado).subscribe({
        next: () => {
          // Recarrega a lista de contratos/projetos para refletir a edição
          this.carregarContratos();
        },
        error: (err) => {
          console.error('Erro ao atualizar projeto', err);
        }
      });
    }
  });
}

  removerProjeto(id: number) {

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: { message: 'Tem certeza que deseja remover este projeto?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
          this.timeboxService.deletarProjeto(id).subscribe(() => this.carregarContratos());

    }
  });
}

 

  // Membro
// Abrir modal para vincular novo membro
vincularMembro(projeto: TimeboxProjeto) {
  const dialogRef = this.dialog.open(MembroDialogComponent, {
    width: '400px',
    data: { TimeboxProjetoId: projeto.Id }
  });

  dialogRef.afterClosed().subscribe((membro: Partial<TimeboxProjetoParticipacao>) => {
    if (!membro) return;

    this.timeboxService.vincularMembro(membro as TimeboxProjetoParticipacao)
      .subscribe(() => this.carregarContratos());
  });
}

editarMembro(m: TimeboxProjetoParticipacao) {
    console.log(m);

  const dialogRef = this.dialog.open(MembroDialogComponent, {
    width: '400px',
    data: m
  });

  dialogRef.afterClosed().subscribe((membroAtualizado: TimeboxProjetoParticipacao) => {
    if (!membroAtualizado) return;

    this.timeboxService
      .atualizarMembro(membroAtualizado.Id!, membroAtualizado)
      .subscribe(() => this.carregarContratos());
  });
}


  removerMembro(id: number) {

   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: { message: 'Tem certeza que deseja remover este membro?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {    
        
        this.timeboxService.deletarMembro(id).subscribe(() => this.carregarContratos());
 
    }
  });
} 

formatDate(dateString: string | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


}

