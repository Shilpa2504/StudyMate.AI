package com.practisespring.Practise_spring.model;
import lombok.Data;
@Data
public class AuthRequest {
    private String username;
    private String email;
    private String password;
}
