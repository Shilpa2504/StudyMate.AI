package com.practisespring.Practise_spring.model;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class QuizAttemptRequest {
    private Long sessionId;
    private int score;
    private int total;
    private List<Map<String, Object>> questions;
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
}
