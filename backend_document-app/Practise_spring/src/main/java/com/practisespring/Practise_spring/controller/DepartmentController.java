package com.practisespring.Practise_spring.controller;

import com.practisespring.Practise_spring.entity.Department;
import com.practisespring.Practise_spring.errorhandling.DepartmentNotFoundException;
import com.practisespring.Practise_spring.service.DepartmentService;
import com.practisespring.Practise_spring.service.DepartmentServiceImpl;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
// for creating rest api
public class DepartmentController {

    @Autowired
//    attaching object with property DI
    private DepartmentService departmentService;


    private final Logger LOGGER  = LoggerFactory.getLogger(DepartmentController.class);
    
    @PostMapping("/departments")
    public Department saveDepartment(@Valid @RequestBody Department department){
//        we need to take the request body from the http and using object mapper convert it from jsn to java object fof that we are using request body
//        DepartmentService service = new DepartmentServiceImpl(); creating object manually if not need this the do in line 13
        return departmentService.saveDepartment(department);
//{
//post http://localhost:8080/departments
// 	"departmentName":"math",
//	"departmentAddress":"bangalore",
//	"departmentCode":"math"
//}



    }

    @GetMapping("/departments")
    public List<Department> fetchDepartmentList(){
        LOGGER.info("Inside saveDepartment of Controller");
        return departmentService.fetchDepartmentList();
    }

    @GetMapping("/departments/{id}")
    public Department fetchDepartmentById(@PathVariable("id") Long departmentId) throws DepartmentNotFoundException {
//here we have to add path variable so that we can map this id with a particular id that we will be sending
        LOGGER.info("Inside fetchDepartment of Controller");

        return departmentService.fetchDepartmentById(departmentId);
    }
    @DeleteMapping("/departments/{id}")
    public String deleteDepartmentByID(@PathVariable("id") Long departmentId){
        departmentService.deleteDepartmentById(departmentId);
        return "department deleted successfully";

    }
    @PutMapping("/departments/{id}")
    public Department updateDepartment(@PathVariable("id") Long departmentId,
                                       @RequestBody Department department){
        return departmentService.updateDepartment(departmentId,department);


    }
    @GetMapping("/departments/name/{name}")
    public Department fetchDepartmentByName(@PathVariable("name") String departmentName){
       return departmentService.fetchDepartmentByName(departmentName);
    }

}

