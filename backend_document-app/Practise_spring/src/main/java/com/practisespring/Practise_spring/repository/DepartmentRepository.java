package com.practisespring.Practise_spring.repository;

import com.practisespring.Practise_spring.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// create interface we will extend th ejpa repository instead of creating a new one since we can use the once available methods ther
public interface DepartmentRepository extends JpaRepository<Department,Long> {
//    wwe will pass entity and id here
    public Department findByDepartmentName(String departmentName);

    Department findByDepartmentNameIgnoreCase(String departmentName);

}
