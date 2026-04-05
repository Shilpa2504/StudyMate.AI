import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class Aiservice {
  private baseUrl = `${environment.apiUrl}/api/document`;

  constructor(private http: HttpClient) { }

  uploadPdf(file: File) {

    const formData = new FormData();
    formData.append("file", file);

    return this.http.post(
      this.baseUrl + "/upload",
      formData,
      { responseType: 'text' }
    );
  }

  askQuestion(documentText: string, question: string) {

    return this.http.post(
      this.baseUrl + "/ask",
      {
        documentText,
        question
      },
      { responseType: 'text' }
    );
  }
}
