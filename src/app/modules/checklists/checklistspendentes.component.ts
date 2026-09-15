import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChecklistsPendentesService } from './checklistspendentes.service';
import { ChecklistPendentes } from './checklistspendentes.model';

@Component({
  selector: 'app-checklists-pendentes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule
  ],
  templateUrl: './checklistspendentes.component.html',
  styleUrls: ['./checklistspendentes.component.css']
})
export class ChecklistsPendentesComponent implements OnInit, AfterViewInit {

  displayedColumns = [
    'solucionador',
    'pendentes90',
    'pendentes60a90',
    'pendentes30a60',
    'pendentes30',
    'pendentes',
    'concluidos'
  ];

  dataSource = new MatTableDataSource<ChecklistPendentes>();
  loading = true;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: ChecklistsPendentesService) {}

  ngOnInit() {
    this.carregar();
  }

  ngAfterViewInit() {
    // Atualiza destaque das células quando a coluna é ordenada
    this.sort.sortChange.subscribe(() => {
      this.atualizarCelasAtivas();
    });
  }

  carregar() {
    this.loading = true;

    this.service.listar().subscribe(dados => {
      this.dataSource.data = dados;

      setTimeout(() => {
        // Ordenação default
        this.dataSource.sort = this.sort;
        this.sort.active = 'pendentes90';
        this.sort.direction = 'desc';
        this.sort.disableClear = true;
        this.sort.sortChange.emit({ active: this.sort.active, direction: this.sort.direction });

        // Atualiza destaque inicial das células
        this.atualizarCelasAtivas();
      });

      this.loading = false;
    }, () => this.loading = false);
  }

  private atualizarCelasAtivas() {
    // Remove classes antigas
    this.displayedColumns.forEach(col => {
      const cells = document.querySelectorAll(`td.mat-column-${col}`);
      cells.forEach(cell => cell.classList.remove('active-column'));
    });

    // Adiciona classe na coluna ativa
    const activeCol = this.sort.active;
    const activeCells = document.querySelectorAll(`td.mat-column-${activeCol}`);
    activeCells.forEach(cell => cell.classList.add('active-column'));
  }
}
