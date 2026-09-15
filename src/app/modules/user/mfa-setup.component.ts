import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from './user.service';

@Component({
  selector: 'app-mfa-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './mfa-setup.component.html',
  styleUrls: ['./mfa-setup.component.css']
})
export class MfaSetupComponent implements OnInit {
  form: FormGroup;
  qrCodeDataUrl = '';
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void { this.generateQRCode(); }

  generateQRCode() {
    this.loading = true;
    this.userService.generateMFA().subscribe({
      next: (res: any) => { this.qrCodeDataUrl = res.qrCodeDataUrl; this.loading = false; },
      error: () => { this.error = 'Erro ao gerar QR Code'; this.loading = false; }
    });
  }

confirmTOTP() {
  if (this.form.invalid) return;

  const user = JSON.parse(localStorage.getItem('user')!);

  this.loading = true;

  this.userService.validateTOTP(this.form.value.code, user.userId)
    .subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: () => {
        this.error = 'Código inválido. Tente novamente.';
        this.loading = false;
      }
    });
}
}