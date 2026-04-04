import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { DocumentService, PdfSession } from '../document.service';
import { AuthService } from '../auth/auth.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  sessions: PdfSession[] = [];
  loading = true;
  expandedId: number | null = null;
  private routerSub!: Subscription;

  constructor(
    private docService: DocumentService,
    private auth: AuthService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.loadSessions();
    // Reload whenever we navigate back to dashboard
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd && (e as NavigationEnd).urlAfterRedirects === '/my-documents')
    ).subscribe(() => this.loadSessions());
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  loadSessions() {
    this.loading = true;
    this.docService.getSessions().subscribe({
      next: data => {
        this.zone.run(() => {
          this.sessions = data;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  deleteSession(id: number) {
    if (!confirm('Delete this document and all its Q&A history?')) return;
    this.docService.deleteSession(id).subscribe({
      next: () => {
        this.zone.run(() => {
          this.sessions = this.sessions.filter(s => s.id !== id);
          this.cdr.detectChanges();
        });
      },
      error: () => alert('Delete failed. Please try again.')
    });
  }

  goToAsk() {
    this.router.navigate(['/ask']);
  }

  goToHistory(id: number) {
    this.router.navigate(['/history', id]);
  }

  goToAskExisting(id: number) {
    this.router.navigate(['/ask-existing', id]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
