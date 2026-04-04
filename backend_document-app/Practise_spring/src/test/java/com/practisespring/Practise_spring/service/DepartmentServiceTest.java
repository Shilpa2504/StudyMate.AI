package com.practisespring.Practise_spring.service;

import com.practisespring.Practise_spring.entity.Department;
import com.practisespring.Practise_spring.repository.DepartmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class DepartmentServiceTest {
    @Autowired
    private DepartmentService departmentService;
    @MockitoBean
    private DepartmentRepository departmentRepository;
    @BeforeEach
    void setUp() {
        //this for macking repo layer so that it can be used we need @builder
        Department department = Department.builder().departmentName("IT").departmentAddress("Bangalore").departmentCode("01").build();
        Mockito.when((departmentRepository.findByDepartmentNameIgnoreCase("IT"))).thenReturn(department) ;
    }
    @Test
    @DisplayName("Get data based on a valid department name")
    //inorder to disable use disable
    //unit testing for service layer
    public void whenValidDepartmentName_thenDepartmentShouldFound(){
    String departmentName = "IT";
    Department found = departmentService.fetchDepartmentByName(departmentName);
    assertEquals(departmentName,found.getDepartmentName());

    }

}