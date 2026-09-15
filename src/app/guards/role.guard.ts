import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const userStr = localStorage.getItem('user');

    if (!userStr) {
      this.router.navigateByUrl('/');
      return false;
    }

    const user = JSON.parse(userStr);
    const perfilUsuario = user.perfil;

    const perfisPermitidos: number[] = route.data['perfis'];

    if (!perfisPermitidos || perfisPermitidos.includes(perfilUsuario)) {
      return true;
    }

    // acesso negado
    this.router.navigateByUrl('/app/dashboard');
    return false;
  }
}
