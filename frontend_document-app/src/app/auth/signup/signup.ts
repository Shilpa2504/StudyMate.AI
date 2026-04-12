import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  username = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

  submit() {
    this.error = '';
    this.loading = true;
    this.cdr.detectChanges();
    this.auth.signup(this.username, this.email, this.password).subscribe({
      next: res => {
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/login']);
      },
      error: err => {
        this.error = err.error?.detail || err.error?.message || 'Signup failed. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
