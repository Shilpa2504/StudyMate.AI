package com.practisespring.Practise_spring.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name="quiz_attempt")
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id")
    @JsonIgnore
    private PdfSession session;

    private int attemptNumber;
    private int score;
    private int total;
    private LocalDateTime attemptedAt;

    @Column(columnDefinition = "TEXT")
    private String questionsJson; // stored as JSON string

}
