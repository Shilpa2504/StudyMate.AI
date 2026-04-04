package com.practisespring.Practise_spring.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Entity
//? with this it will be enity which will make it visible to all classes
@Data
// use this to ese lombok replacing all getter setter etc @data or u can directly use it by adding @ getter @setter
@NoArgsConstructor
@AllArgsConstructor
// for constructor from lombok
@Builder
public class Department {
    @Id
//    we have to give primary key here for db
    @GeneratedValue(strategy = GenerationType.AUTO)
//    THIS WILL MAKE IT as primary key
    // validation we need to add the package and then add the validation here in entity which we want
    private Long departmentId;
    @NotBlank(message = " please add name")
//    @Length(max=5,min =1)
//    @Size(max=5,min =1)
//    @Email
//    @Positive@Negative
//    @PositiveOrZero
//    @NegativeOrZero
//    @Future
//    @FutureOrPresent
//    @Past
//    @PastOrPresent
    // this is validation now add @ validation in name api where we have called in controller
    private String departmentName ;
    private String departmentAddress;
    private String departmentCode;

// here we have removed all the getter setter as we have added lombok so lombok will be used for all te getter setter constructor default consttructor
//    public Long getDepartmentId() {
//        return departmentId;
//    }
//
//    public void setDepartmentId(Long departmentId) {
//        this.departmentId = departmentId;
//    }
//
//
//    public String getDepartmentCode() {
//        return departmentCode;
//    }
//
//    public void setDepartmentCode(String departmentCode) {
//        this.departmentCode = departmentCode;
//    }
//
//    public String getDepartmentAddress() {
//        return departmentAddress;
//    }
//
//    public void setDepartmentAddress(String departmentAddress) {
//        this.departmentAddress = departmentAddress;
//    }
//
//    public String getDepartmentName() {
//        return departmentName;
//    }
//
//    public void setDepartmentName(String departmentName) {
//        this.departmentName = departmentName;
//    }
//
//    public Department() {
//    }
//
//    public Department(Long departmentId, String departmentName, String departmentAddress, String departmentCode) {
//        this.departmentId = departmentId;
//        this.departmentName = departmentName;
//        this.departmentAddress = departmentAddress;
//        this.departmentCode = departmentCode;
//    }
//
//    @Override
//    public String toString() {
//        return "department{" +
//                "departmentId=" + departmentId +
//                ", departmentName='" + departmentName + '\'' +
//                ", departmentAddress='" + departmentAddress + '\'' +
//                ", departmentCode='" + departmentCode + '\'' +
//                '}';
//    }


}
