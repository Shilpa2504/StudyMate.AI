import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { DocumentService, PdfSession, QuizAttemptHistory } from '../document.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  username = '';
  sessions: PdfSession[] = [];
  totalQAs = 0;
  totalQuizAttempts = 0;
  isDark = true;

  features = [
    {
      icon: '📄',
      title: 'PDF Upload',
      desc: 'Upload any PDF. Duplicate detection via SHA-256 hashing ensures no file is stored twice.',
      color: 'purple',
      action: () => this.router.navigate(['/ask'])
    },
    {
      icon: '🤖',
      title: 'AI Q&A',
      desc: 'Ask any question about your document and get instant AI-powered answers.',
      color: 'blue',
      action: () => this.router.navigate(['/my-documents'])
    },
    {
      icon: '📝',
      title: 'Quiz Generator',
      desc: 'Auto-generate 5 multiple choice questions from your PDF and test your knowledge.',
      color: 'teal',
      action: () => this.router.navigate(['/my-documents'])
    },
    {
      icon: '📜',
      title: 'Q&A History',
      desc: 'All your questions and AI answers are saved per document for easy review.',
      color: 'indigo',
      action: () => this.router.navigate(['/my-documents'])
    },
    {
      icon: '📊',
      title: 'Attempt Analytics',
      desc: 'Visual bar chart of your quiz scores across attempts. Track your improvement.',
      color: 'violet',
      action: () => document.getElementById('analytics-section')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      icon: '💡',
      title: 'About StudyMate',
      desc: 'StudyMate AI is your all-in-one study companion — upload PDFs, get AI answers, generate quizzes and track your learning journey.',
      color: 'rose',
      action: () => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  ];

  // quiz analytics — last 6 attempts across all sessions
  quizBars: { label: string; pct: number; score: string }[] = [];
  allQuizHistory: QuizAttemptHistory[] = [];
  expandedQuizId: number | null = null;

  constructor(
    private router: Router,
    private auth: AuthService,
    private docService: DocumentService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private theme: ThemeService
  ) {
    this.username = this.auth.getUsername();
    this.isDark = this.theme.isDark();
  }

  ngOnInit() {
    this.docService.getSessions().subscribe({
      next: data => {
        this.zone.run(() => {
          this.sessions = data;
          this.totalQAs = data.reduce((s, d) => s + (d.qaHistory?.length || 0), 0);
          this.totalQuizAttempts = data.reduce((s, d) => s + (d.quizAttempts || 0), 0);
          this.cdr.detectChanges();
        });
      },
      error: () => { }
    });

    // load quiz history for first session that has attempts for the graph
    this.loadQuizGraph();
    this.loadAllQuizHistory();
  }

  loadAllQuizHistory() {
    this.docService.getAllQuizHistory().subscribe({
      next: data => {
        this.zone.run(() => {
          this.allQuizHistory = data;
          this.cdr.detectChanges();
        });
      },
      error: () => { }
    });
  }

  toggleQuiz(id: number) {
    this.expandedQuizId = this.expandedQuizId === id ? null : id;
  }

  percent(a: QuizAttemptHistory) {
    return Math.round((a.score / a.total) * 100);
  }

  loadQuizGraph() {
    this.docService.getSessions().subscribe({
      next: sessions => {
        const withAttempts = sessions.filter(s => s.quizAttempts > 0);
        if (!withAttempts.length) return;
        // use the session with most attempts
        const top = withAttempts.sort((a, b) => b.quizAttempts - a.quizAttempts)[0];
        this.docService.getQuizHistory(top.id).subscribe({
          next: history => {
            this.zone.run(() => {
              this.quizBars = history.slice(-6).map((a, i) => ({
                label: `#${a.attemptNumber}`,
                pct: Math.round((a.score / a.total) * 100),
                score: `${a.score}/${a.total}`
              }));
              this.cdr.detectChanges();
            });
          },
          error: () => { }
        });
      },
      error: () => { }
    });
  }

  goToDocuments() { this.router.navigate(['/my-documents']); }
  goToQuizHistory() { this.router.navigate(['/all-quiz-history']); }
  toggleTheme() { this.theme.toggle(); this.isDark = this.theme.isDark(); }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
