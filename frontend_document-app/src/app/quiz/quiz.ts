import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../document.service';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

@Component({
  selector: 'app-quiz',
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit {
  sessionId!: number;
  filename = '';
  documentText = '';
  state: 'idle' | 'generating' | 'answering' | 'result' = 'idle';
  questions: QuizQuestion[] = [];
  selected: (number | null)[] = [];
  score = 0;
  attempts = 0;

  constructor(
    private route: ActivatedRoute,
    private docService: DocumentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.sessionId = Number(this.route.snapshot.paramMap.get('id'));
    this.docService.getSession(this.sessionId).subscribe({
      next: data => {
        this.zone.run(() => {
          this.filename = data.filename;
          this.documentText = data.documentText ?? '';
          this.attempts = data.quizAttempts ?? 0;
          this.cdr.detectChanges();
        });
      },
      error: () => alert('Could not load document.')
    });
  }

  generateQuiz() {
    this.state = 'generating';
    this.questions = [];
    this.selected = [];
    this.cdr.detectChanges();
    this.docService.generateQuiz(this.sessionId, this.documentText).subscribe({
      next: (qs: QuizQuestion[]) => {
        this.zone.run(() => {
          this.questions = qs;
          this.selected = new Array(qs.length).fill(null);
          this.state = 'answering';
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          alert('Failed to generate quiz. Try again.');
          this.state = 'idle';
          this.cdr.detectChanges();
        });
      }
    });
  }

  allAnswered(): boolean {
    return this.selected.every(s => s !== null);
  }

  submitQuiz() {
    this.score = this.questions.reduce((acc, q, i) =>
      acc + (this.selected[i] === q.correctIndex ? 1 : 0), 0);

    const payload = {
      sessionId: this.sessionId,
      score: this.score,
      total: this.questions.length,
      questions: this.questions.map((q, i) => ({
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        selectedIndex: this.selected[i] as number
      }))
    };

    this.docService.saveQuizAttempt(payload).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.attempts = res.totalAttempts;
          this.state = 'result';
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.state = 'result';
          this.cdr.detectChanges();
        });
      }
    });
  }

  viewHistory() {
    this.router.navigate(['/quiz-history', this.sessionId]);
  }

  goBack() {
    window.history.back();
  }
}
