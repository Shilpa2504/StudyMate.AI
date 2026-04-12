package com.practisespring.Practise_spring.repository;

import com.practisespring.Practise_spring.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findBySessionIdOrderByAttemptNumberAsc(Long sessionId);
    List<QuizAttempt> findBySessionIdInOrderByAttemptedAtDesc(List<Long> sessionIds);
}

