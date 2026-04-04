package com.practisespring.Practise_spring.service;

import com.practisespring.Practise_spring.entity.User;
import com.practisespring.Practise_spring.model.AuthRequest;
import com.practisespring.Practise_spring.model.AuthResponse;
import com.practisespring.Practise_spring.repository.UserRepository;
import com.practisespring.Practise_spring.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse signup(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        if (userRepository.existsByUsername(request.getUsername()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getUsername());
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getUsername());
    }
}
