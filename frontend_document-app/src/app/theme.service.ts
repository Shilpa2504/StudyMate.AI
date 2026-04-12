import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private dark = true;

  constructor() {
    const saved = localStorage.getItem('theme');
    this.dark = saved ? saved === 'dark' : true;
    this.apply();
  }

  toggle() {
    this.dark = !this.dark;
    localStorage.setItem('theme', this.dark ? 'dark' : 'light');
    this.apply();
  }

  isDark() { return this.dark; }

  private apply() {
    document.body.setAttribute('data-theme', this.dark ? 'dark' : 'light');
  }
}
