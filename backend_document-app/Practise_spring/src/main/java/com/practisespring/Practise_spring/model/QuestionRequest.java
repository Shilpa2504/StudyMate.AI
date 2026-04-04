package com.practisespring.Practise_spring.model;
import lombok.Data;

@Data
public class QuestionRequest {
    private Long sessionId;
    private String documentText;
    private String question;

}
