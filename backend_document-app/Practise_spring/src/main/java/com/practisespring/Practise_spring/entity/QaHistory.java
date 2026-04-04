package com.practisespring.Practise_spring.entity;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@Table(name = "qa_history")
public class QaHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String question;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "session_id")
    private PdfSession session;

}
