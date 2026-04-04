import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService, QuizAttemptHistory } from '../document.service';

@Component({
  selector: 'app-quiz-history',
  imports: [CommonModule],
  template: `
<div class="qh-page">
  <div class="topbar">
    <button class="btn-back" (click)="goBack()">Back to Quiz</button>
    <div class="topbar-title">Quiz Attempt History</div>
  </div>
  @if(loading) {
    <div class="loading">Loading history...</div>
  }
  @if(!loading && attempts.length === 0) {
    <div class="empty">No quiz attempts yet.</div>
  }
  @if(!loading && attempts.length > 0) {
    <div class="attempts-list">
      @for(attempt of attempts; track attempt.id) {
        <div class="attempt-card">
          <div class="attempt-header" (click)="toggle(attempt.id)">
            <div class="attempt-meta">
              <span class="attempt-num">Attempt #{{ attempt.attemptNumber }}</span>
            </div>
            <div class="attempt-score-row">
              <div class="score-pill" [class.good]="percent(attempt) >= 60" [class.bad]="percent(attempt) < 60">
                {{ attempt.score }} / {{ attempt.total }} ({{ percent(attempt) }}%)
              </div>
              <span class="chevron">{{ expandedId === attempt.id ? 'Hide' : 'Show' }}</span>
            </div>
          </div>
          @if(expandedId === attempt.id) {
            <div class="questions-list">
              @for(q of attempt.questions; track $index; let qi = $index) {
                <div class="q-item"
                  [class.correct]="q['selectedIndex'] === q['correctIndex']"
                  [class.wrong]="q['selectedIndex'] !== q['correctIndex']">
                  <div class="q-status">{{ q['selectedIndex'] === q['correctIndex'] ? 'Correct' : 'Wrong' }}</div>
                  <div class="q-content">
                    <div class="q-text">Q{{ qi + 1 }}: {{ q['question'] }}</div>
                    <div class="q-ans your">Your answer: {{ q['options'][q['selectedIndex']] }}</div>
                    @if(q['selectedIndex'] !== q['correctIndex']) {
                      <div class="q-ans correct">Correct: {{ q['options'][q['correctIndex']] }}</div>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  }
</div>
  `,
  styleUrl: './quiz-history.css',
})
export class QuizHistory implements OnInit {
  sessionId!: number;
  attempts: QuizAttemptHistory[] = [];
  loading = true;
  expandedId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private docService: DocumentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.sessionId = Number(this.route.snapshot.paramMap.get('id'));
    this.docService.getQuizHistory(this.sessionId).subscribe({
      next: data => {
        this.zone.run(() => {
          this.attempts = data;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          console.error('Quiz history error:', err);
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  toggle(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  percent(a: QuizAttemptHistory) {
    return Math.round((a.score / a.total) * 100);
  }

  goBack() {
    this.router.navigate(['/quiz', this.sessionId]);
  }
}
