import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule, RouterOutlet } from '@angular/router'; 
import { AuthService } from '../user/auth.service'; // ajuste o caminho conforme seu projeto
import { CommonModule } from '@angular/common'; // 👈 IMPORTANTE
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../dialogs/change-password-dialog.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule,RouterModule, RouterOutlet],
  templateUrl: './main_layout.component.html',
  styleUrls: ['./main_layout.component.css']
})
export class MainLayoutComponent {

  usuario: string | null = null;
  perfil!: number;

  // flags de permissão
  isAdmin = false;
  isLider = false;
  isBackOffice = false;
  isAnalista = false;
  isProjetos = false;
  isRH = false;

//  constructor(
//    private router: Router,
//    private authService: AuthService  // ← injetando o AuthService
//  ) {
    // pega usuário do localStorage
//    const user = localStorage.getItem('user');
//    this.usuario = user ? JSON.parse(user).username : null;
 // }

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    const userStr = localStorage.getItem('user');

    if (userStr) {
      const user = JSON.parse(userStr);

      this.usuario = user.username;
      this.perfil = user.perfil;

      this.setPermissoes(this.perfil);
    }
  }

  private setPermissoes(perfil: number) {
    this.isAdmin = perfil === 1;
    this.isLider = perfil === 2;
    this.isBackOffice = perfil === 3;
    this.isAnalista = perfil === 4;
    this.isProjetos = perfil === 5;
    this.isRH = perfil === 6;
  }

  logout() {
    this.authService.logout();        // remove login
    this.router.navigateByUrl('/');   // retorna para login
  }

  trocarSenha() {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px', // menor que antes 
      height: '350px' // deixa altura automática para evitar scroll
    }).afterClosed().subscribe(ok => {
      if (ok) {
        alert('Senha alterada com sucesso');
        // opcional: forçar logout
        // this.logout();
      }
    });
  }
}
