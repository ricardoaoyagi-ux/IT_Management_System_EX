// src/app/modules/user/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from './user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      AnalistaId: ['', Validators.required],
      Perfil: ['', Validators.required],
      Username: ['', [Validators.required, Validators.minLength(3)]],
      Password: ['Teste01#', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.message = 'Preencha todos os campos corretamente';
      return;
    }

    this.userService.register(this.registerForm.value).subscribe({
      next: res => {
        this.message = `Usuário ${res.Username} criado com sucesso!`;
        this.registerForm.reset();
      },
      error: err => this.message = err.error?.message || 'Erro ao criar usuário'
    });
  }
}