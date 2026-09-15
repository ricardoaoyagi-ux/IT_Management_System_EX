import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

  const userJson = localStorage.getItem('user');

  if (!userJson) {
    this.router.navigate(['/']);
    return false;
  }

  const user = JSON.parse(userJson);

  // ✅ LIBERA MFA SEM BLOQUEIO
  if (state.url.startsWith('/mfa')) {
    return true;
  }

  // 🔐 BLOQUEIA acesso ao APP se MFA não validado
  if (user.mfaRequired && !user.mfaVerified) {
    this.router.navigateByUrl(
      user.setupMFA ? '/mfa/setup' : '/mfa/verify'
    );
    return false;
  }

  return true;
}
}