package com.practisespring.Practise_spring.service;


import com.practisespring.Practise_spring.entity.Department;
import com.practisespring.Practise_spring.errorhandling.DepartmentNotFoundException;

import java.util.List;

public interface DepartmentService {
    public Department saveDepartment(Department department);

   public List<Department> fetchDepartmentList();

  public  Department fetchDepartmentById(Long departmentId) throws DepartmentNotFoundException;

    public void deleteDepartmentById(Long departmentId);

   public Department updateDepartment(Long departmentId, Department department);

    public Department fetchDepartmentByName(String departmentName);
}
