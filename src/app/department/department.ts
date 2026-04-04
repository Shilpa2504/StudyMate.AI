import { Component,OnInit } from '@angular/core';
import { DepartmentService } from '../department';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-department',
  imports: [CommonModule],
  templateUrl: './department.html',
  styleUrl: './department.css',
})
export class DepartmentComponent implements OnInit {

  departments:any[] = [];

  constructor(private deptService: DepartmentService){}

  ngOnInit(){
    this.deptService.getDepartments().subscribe((data:any)=>{
       console.log("DATA FROM API:", data);   // debug
      this.departments = data;
    });
  }

}