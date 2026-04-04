import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuizQuestion } from './quiz/quiz';

export interface QaItem {
  id: number;
  question: string;
  answer: string;
}

export interface PdfSession {
  id: number;
  filename: string;
  uploadedAt: string;
  documentText: string;
  qaHistory: QaItem[];
  quizAttempts: number;
}

export interface QuizAttemptResult {
  sessionId: number;
  score: number;
  total: number;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    selectedIndex: number;
  }[];
}

export interface QuizAttemptHistory {
  id: number;
  attemptNumber: number;
  score: number;
  total: number;
  attemptedAt: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    selectedIndex: number;
  }[];
}

export interface UploadResponse {
  sessionId: number;
  text: string;
  duplicate: boolean;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private base = 'http://localhost:8080/api/document';

  constructor(private http: HttpClient) { }

  uploadPdf(file: File, fileHash: string) {
    const form = new FormData();
    form.append('file', file);
    form.append('fileHash', fileHash);
    return this.http.post<UploadResponse>(`${this.base}/upload`, form);
  }

  askQuestion(sessionId: number, documentText: string, question: string) {
    return this.http.post(
      `${this.base}/ask`,
      { sessionId, documentText, question },
      { responseType: 'text' }
    );
  }

  getSessions() {
    return this.http.get<PdfSession[]>(`${this.base}/sessions`);
  }

  getSession(id: number) {
    return this.http.get<PdfSession>(`${this.base}/sessions/${id}`);
  }

  deleteSession(id: number) {
    return this.http.delete(`${this.base}/sessions/${id}`);
  }

  generateQuiz(sessionId: number, documentText: string) {
    return this.http.post<QuizQuestion[]>(
      `${this.base}/quiz/generate`,
      { sessionId, documentText }
    );
  }

  saveQuizAttempt(payload: QuizAttemptResult) {
    return this.http.post<{ totalAttempts: number; attemptId: number }>(
      `${this.base}/quiz/attempt`, payload
    );
  }

  getQuizHistory(sessionId: number) {
    return this.http.get<QuizAttemptHistory[]>(`${this.base}/quiz/history/${sessionId}`);
  }
}
