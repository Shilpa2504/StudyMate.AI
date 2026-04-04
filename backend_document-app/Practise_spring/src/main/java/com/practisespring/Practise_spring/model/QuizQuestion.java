package com.practisespring.Practise_spring.model;

import lombok.Data;

import java.util.List;
@Data
public class QuizQuestion {
    private String question;
    private List<String> options;
    private int correctIndex;
}
