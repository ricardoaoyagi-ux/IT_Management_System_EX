import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user.service';
import { User } from './user.model';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule,
    CommonModule, 
    ReactiveFormsModule, 
    MatTableModule, 
    MatInputModule, 
    MatButtonModule, 
    HttpClientModule,
    MatSelectModule ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['Id', 'AnalistaId', 'Perfil', 'Username', 'MFA', 'actions'];
  form: FormGroup;
  editingUserId: number | null = null;

  // mapeamento de perfis
perfilMap: { [key: number]: string } = {
  1: 'Administrador',
  2: 'Lider Sustain',
  3: 'Carga Incidente',
  4: 'Analista Sustain',
  5: 'Projetos (TBD)',
  6: 'Interno'
};
perfilOptions = [
  { id: 1, nome: 'Administrador' },
  { id: 2, nome: 'Lider Sustain' },
  { id: 3, nome: 'Carga Incidente' },
  { id: 4, nome: 'Analista Sustain' },
  { id: 5, nome: 'Projetos (TBD)' },
  { id: 6, nome: 'Interno' }
];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      AnalistaId: [{ value: '', disabled: true }], // Sempre desabilitado
      Perfil: ['', Validators.required],
      Username: ['', Validators.required],
      PasswordHash: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  get isEditing(): boolean {
    return this.editingUserId !== null;
  }

  loadUsers() {
    this.userService.getUsers().subscribe(data => this.users = data);
  }

  editUser(user: User) {
    this.editingUserId = user.Id || null;
  
    this.form.patchValue({
      AnalistaId: user.AnalistaId,
      Perfil: user.Perfil,
      Username: user.Username,
      PasswordHash: '' // sempre vazio ao editar
    });
  
    // Garantia extra (defensivo)
    this.form.get('Username')?.disable();
    this.form.get('AnalistaId')?.disable();
  }
  

  cancelEdit() {
    this.editingUserId = null;
    this.form.reset();
  
    // Reabilita Username para novo cadastro
    this.form.get('Username')?.enable();
  }
  

  saveUser() {
    if (this.form.invalid) return;
  
    const raw = this.form.getRawValue();
  
    // Garante que AnalistaId seja number, mesmo desabilitado
    const user: User = {
      AnalistaId: raw.AnalistaId ?? 0, // ou outro valor padrão temporário
      Perfil: raw.Perfil,
      Username: raw.Username,
      PasswordHash: raw.PasswordHash
    };
  
    if (this.editingUserId) {
      this.userService.updateUser(this.editingUserId, user).subscribe(() => {
        this.loadUsers();
        this.cancelEdit();
      });
    } else {
      this.userService.createUser(user).subscribe(() => {
        this.loadUsers();
        this.form.reset();
      });
    }
  }
onResetMFA(user: User) {
  if (confirm(`Deseja resetar MFA do usuário ${user.Username}?`)) {
    this.userService.resetMFA(user.Id!).subscribe({
      next: () => {
        alert('MFA resetado com sucesso');
        this.loadUsers(); // recarrega lista
      },
      error: (err) => alert('Erro ao resetar MFA')
    });
  }
}
}
