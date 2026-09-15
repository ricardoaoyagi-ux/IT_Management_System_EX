import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenteService } from './incidente.service';
import { Incidente } from './incidente.model';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-incidente',
  standalone: true,
  imports: [
    RouterModule, // <-- Adicionado para [routerLink]
    CommonModule,
    MatTableModule,
    MatCheckboxModule, // ✅ checkbox
    FormsModule       // ✅ ngModel
  ],
  templateUrl: './incidente.component.html',
  styleUrls: ['./incidente.component.css']
})
export class IncidenteComponent implements OnInit {

  lista: Incidente[] = [];
  apenasMeus: boolean = false; // 🔹 controla o filtro

  // 🔹 apenas os campos de consulta
  displayedColumns = [
    'Id_Incidente',
    'Cod_Classificacao1',
    'Dt_Resolucao',
    'Solucionador'
  ];

  constructor(private service: IncidenteService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    if (this.apenasMeus) {
      // 🔹 Busca apenas os incidentes do usuário logado
      //const username = localStorage.getItem('user') || '';

      const userJson = localStorage.getItem('user'); // pega o objeto armazenado
      if (!userJson) {
        console.error('Usuário não encontrado no localStorage!');
        return;
      }
    
      const user = JSON.parse(userJson); // transforma string em objeto
      const username = user.username;     // pega só o username

      this.service.listarMeus(username).subscribe(dados => {
        this.lista = dados.map(i => ({
          ...i,
          Dt_Resolucao: i.Dt_Resolucao?.slice(0, 10)
        }));
      });
    } else {
      this.service.listar().subscribe(dados => {
        this.lista = dados.map(i => ({
          ...i,
          Dt_Resolucao: i.Dt_Resolucao?.slice(0, 10)
        }));
      });
    }
  }



  /*
  // 🔒 funcionalidades preservadas para uso futuro

  form: FormGroup;
  editingId: number | null = null;

  onSubmit() {}
  editar(i: Incidente) {}
  cancelarEdicao() {}
  deletar(id: number) {}
  */
}
