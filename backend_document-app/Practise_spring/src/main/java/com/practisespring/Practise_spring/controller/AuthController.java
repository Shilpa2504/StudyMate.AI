package com.practisespring.Practise_spring.controller;

import com.practisespring.Practise_spring.model.AuthRequest;
import com.practisespring.Practise_spring.model.AuthResponse;
import com.practisespring.Practise_spring.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(authService.signup(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
