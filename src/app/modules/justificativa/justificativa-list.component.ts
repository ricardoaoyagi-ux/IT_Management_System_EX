import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JustificativaBaseService } from './justificativa.service';
import { Justificativa } from './justificativa.model';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { JustificativaDialogComponent } from './justif-dialog.component'; 
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-justificativa-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './justificativa-list.component.html',
  styleUrls: ['./justificativa-list.component.css']
})
export class JustificativaListComponent {

  @Input() titulo!: string;
  @Input() service!: JustificativaBaseService;

  lista: Justificativa[] = [];
  apenasMeus = false;
  usuario = JSON.parse(localStorage.getItem('user')!).username;

  displayedColumns = ['cod_incidente', 'Solucionador', 'data'];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    const obs$ = this.apenasMeus
      ? this.service.listarMeus(this.usuario)
      : this.service.listar();

    obs$.subscribe(dados => {
      this.lista = dados.map(d => ({
        ...d,
        data: d.data?.slice(0, 10)
      }));
    });
  }

  abrirDetalhe(item: Justificativa) {
    this.dialog.open(JustificativaDialogComponent, {
      width: '900px',
      height: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        ...item,
        service: this.service,
        titulo: this.titulo   // ✅ PASSANDO O TÍTULO
      }
    }).afterClosed().subscribe(ok => ok && this.carregar());
  }
}
