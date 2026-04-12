import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DocumentService, QuizAttemptHistory } from '../document.service';

@Component({
  selector: 'app-all-quiz-history',
  imports: [CommonModule],
  templateUrl: './all-quiz-history.html',
  styleUrl: './all-quiz-history.css',
})
export class AllQuizHistory implements OnInit {
  attempts: QuizAttemptHistory[] = [];
  loading = true;
  expandedId: number | null = null;

  constructor(
    private docService: DocumentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.docService.getAllQuizHistory().subscribe({
      next: data => {
        this.zone.run(() => {
          this.attempts = data;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggle(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  percent(a: QuizAttemptHistory) {
    return Math.round((a.score / a.total) * 100);
  }

  goBack() { window.history.back(); }
}
