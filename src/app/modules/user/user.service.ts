import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  // Listar todos os usuários
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Obter usuário por Id
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Criar usuário
  createUser(user: User): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  // Atualizar usuário
  updateUser(id: number, user: User): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }
   // ✅ Resetar MFA (novo método)
  resetMFA(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/mfa-reset`, {});
  }

// Novo método para gerar QR Code
// Adicionar chamadas para MFA
generateMFA() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return this.http.post('http://localhost:3000/mfa/generate-mfa', {
    userId: user.userId,
    username: user.username
  });
}

validateTOTP(code: string, userId: number) {
  return this.http.post('http://localhost:3000/mfa/validate-totp', {
    code,
    userId
  });
}

register(user: User): Observable<any> {
  return this.createUser(user);
}
}
