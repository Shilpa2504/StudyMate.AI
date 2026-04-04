import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-ask-existing',
  imports: [CommonModule, FormsModule],
  templateUrl: './ask-existing.html',
  styleUrl: './ask-existing.css',
})
export class AskExisting implements OnInit {
  sessionId!: number;
  filename = '';
  documentText = '';
  question = '';
  answer = '';
  loading = false;
  ready = false;

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
          this.ready = true;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          alert('Could not load document. Please go back.');
          this.cdr.detectChanges();
        });
      }
    });
  }

  askQuestion() {
    if (!this.question.trim()) return;
    this.loading = true;
    this.answer = '';
    this.cdr.detectChanges();
    this.docService.askQuestion(this.sessionId, this.documentText, this.question).subscribe({
      next: res => {
        this.zone.run(() => {
          this.answer = res;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.answer = 'Error getting response. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  viewHistory() {
    this.router.navigate(['/history', this.sessionId]);
  }

  goToQuiz() {
    this.router.navigate(['/quiz', this.sessionId]);
  }
}
