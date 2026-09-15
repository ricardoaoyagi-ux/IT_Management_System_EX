import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

declare var grecaptcha: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
templateUrl: './login.component.html', 
styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  base = '';
  user = '';
  senha = '';
  captchaToken: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    // Garante que o grecaptcha esteja carregado
setTimeout(() => {
  if (typeof grecaptcha !== 'undefined') {
    grecaptcha.render('captcha', {
      sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // chave pública de teste do Google (sempre valida) - troque em produção
      callback: (token: string) => {
        this.captchaToken = token;
        console.log('Captcha token recebido:', token);
      }
    });
  } else {
    console.error('grecaptcha não carregado');
  }
}, 500);
  }

  login() {
      console.log('CLIQUEI NO LOGIN');
      localStorage.removeItem('user');
    if (!this.base || !this.user || !this.senha) {
      return alert('Informe base, usuário e senha');
    }

    if (!this.captchaToken) {
      return alert('Confirme que você não é um robô');
    }

    localStorage.setItem('base', this.base);



    
    this.authService.login(this.user, this.senha, this.captchaToken).subscribe({
      next: (res: any) => {
          //console.log('RESPOSTA BACKEND:', res);
        localStorage.setItem('user', JSON.stringify(res));

        if (res.mfaRequired && !res.mfaVerified) {
          // Redireciona para setup ou verify conforme setupMFA
          this.router.navigateByUrl(res.setupMFA ? '/mfa/setup' : '/mfa/verify');
        } else {
          // Dashboard principal
          this.router.navigateByUrl('/app/dashboard');
        }
      },
      error: () => {
        alert('Usuário ou senha inválidos');
        (window as any).grecaptcha.reset();
        this.captchaToken = null;
      }
    });
  }
}