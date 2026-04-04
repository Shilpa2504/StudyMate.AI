import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
// add the url in whixh its running 
export class DepartmentService {

  private apiUrl = "http://localhost:8080/departments";

  constructor(private http: HttpClient) {}

  getDepartments(){
    return this.http.get(this.apiUrl);
  }
}
