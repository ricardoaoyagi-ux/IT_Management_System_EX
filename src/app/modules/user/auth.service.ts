import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth'; // ajuste para sua API

  constructor(private http: HttpClient) {}

  login(username: string, password: string, captcha: string): Observable<any> {
    // ⚠️ não precisa enviar a base, o interceptor já adiciona o x-base
    return this.http.post(`${this.baseUrl}/login`, { username, senha: password,
    captcha });
  }

  logout(): void {
    localStorage.removeItem('user'); // remove login
  }

  isLogged(): boolean {
    return !!localStorage.getItem('user'); // retorna true se usuário está logado
  }

  getUsuario(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  trocarSenha(novaSenha: string) {
    const user = JSON.parse(localStorage.getItem('user')!);
  
    return this.http.put(
      `http://localhost:3000/users/${user.id}/password`,
      { senha: novaSenha }
    );
  }
  
}
