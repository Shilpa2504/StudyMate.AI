package com.practisespring.Practise_spring.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Data
@Table(name ="pdf_session")
public class PdfSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    @Column(columnDefinition = "TEXT")
    private String documentText;

    private LocalDateTime uploadedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<QaHistory> qaHistory = new ArrayList<>();

    @Column(unique = true)
    private String fileHash;
    public String getFileHash() { return fileHash; }
    public void setFileHash(String fileHash) { this.fileHash = fileHash; }

    @Column(columnDefinition = "INT DEFAULT 0")
    private int quizAttempts = 0;

    @Column(name = "user_id")
    private Long userId;
}
