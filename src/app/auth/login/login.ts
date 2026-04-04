import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

  submit() {
    this.error = '';
    this.loading = true;
    this.cdr.detectChanges();
    this.auth.login(this.email, this.password).subscribe({
      next: res => {
        this.auth.saveSession(res.token, res.username);
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/']);
      },
      error: err => {
        this.error = err.error?.message || 'Invalid email or password.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
