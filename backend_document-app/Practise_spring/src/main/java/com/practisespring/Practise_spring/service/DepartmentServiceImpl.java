package com.practisespring.Practise_spring.service;

import com.practisespring.Practise_spring.entity.Department;
import com.practisespring.Practise_spring.errorhandling.DepartmentNotFoundException;
import com.practisespring.Practise_spring.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public Department saveDepartment(Department department) {
        return departmentRepository.save(department);
    }

    @Override
    public List<Department> fetchDepartmentList() {
        return departmentRepository.findAll();
    }

    @Override
    public Department fetchDepartmentById(Long departmentId) throws DepartmentNotFoundException {
        //we are adding optional for exception as it is the return statement here for the method dindby id
        Optional<Department> department = departmentRepository.findById(departmentId);
        if(!department.isPresent()){
            throw new DepartmentNotFoundException("dEpartment not available ");
        }
        return department.get();
//        departmentRepository.findById(departmentId).get(); we will be using like this but when we add optional we will remove get
    }

    @Override
    public void deleteDepartmentById(Long departmentId) {
        departmentRepository.deleteById(departmentId);
    }

    @Override
    public Department updateDepartment(Long departmentId, Department department) {

        Department depDB = departmentRepository.findById(departmentId).get();
        if(Objects.nonNull(department.getDepartmentName()) && ! "".equalsIgnoreCase((department.getDepartmentName()))){
            depDB.setDepartmentName(department.getDepartmentName());
        }

        if(Objects.nonNull(department.getDepartmentCode()) && ! "".equalsIgnoreCase((department.getDepartmentCode()))){
            depDB.setDepartmentCode(department.getDepartmentCode());
        }
        if(Objects.nonNull(department.getDepartmentAddress()) && ! "".equalsIgnoreCase((department.getDepartmentAddress()))){
            depDB.setDepartmentAddress(department.getDepartmentAddress());
        }
        return departmentRepository.save(depDB);
    }
// this was not available in jpa repo so we made it by our own we have added in the repo this method
    @Override
    public Department fetchDepartmentByName(String departmentName) {
        return departmentRepository.findByDepartmentNameIgnoreCase(departmentName);
    }
}
