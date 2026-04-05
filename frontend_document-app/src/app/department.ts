import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
// add the url in whixh its running 
export class DepartmentService {

  private apiUrl = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) { }

  getDepartments() {
    return this.http.get(this.apiUrl);
  }
}
