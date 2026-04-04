import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-ai-document',
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-document.html',
  styleUrl: './ai-document.css',
})
export class AiDocument {
  documentText = '';
  question = '';
  answer = '';
  loading = false;
  isUploaded = false;
  sessionId: number | null = null;
  filename = '';

  constructor(
    private docService: DocumentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  async uploadFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.filename = file.name;

    // Compute SHA-256 hash of file content to detect duplicates
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    this.docService.uploadPdf(file, fileHash).subscribe({
      next: res => {
        this.zone.run(() => {
          if (res.duplicate) {
            // Same PDF already exists — redirect to its existing session
            this.router.navigate(['/ask-existing', res.sessionId]);
            return;
          }
          this.documentText = res.text;
          this.sessionId = res.sessionId;
          this.isUploaded = true;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          alert('Upload failed. Please try again.');
          this.cdr.detectChanges();
        });
      }
    });
  }

  askQuestion() {
    if (!this.documentText || !this.sessionId) {
      alert('Please upload a PDF first');
      return;
    }
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
          this.answer = 'Error: could not get a response. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
