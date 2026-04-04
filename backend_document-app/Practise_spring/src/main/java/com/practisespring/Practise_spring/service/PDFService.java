package com.practisespring.Practise_spring.service;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.practisespring.Practise_spring.entity.QuizAttempt;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class PDFService {
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<QuizAttempt> quizAttemptList = new ArrayList<>();
    public String extractText(MultipartFile file) throws Exception {

        PDDocument document = PDDocument.load(file.getInputStream());

        PDFTextStripper stripper = new PDFTextStripper();

        String text = stripper.getText(document);

        document.close();

        return text;
    }
}
