package com.practisespring.Practise_spring.controller;

import com.practisespring.Practise_spring.entity.PdfSession;
import com.practisespring.Practise_spring.entity.QaHistory;
import com.practisespring.Practise_spring.entity.QuizAttempt;
import com.practisespring.Practise_spring.model.QuestionRequest;
import com.practisespring.Practise_spring.model.QuizAttemptRequest;
import com.practisespring.Practise_spring.model.QuizQuestion;
import com.practisespring.Practise_spring.repository.PdfSessionRepository;
import com.practisespring.Practise_spring.repository.QuizAttemptRepository;
import com.practisespring.Practise_spring.service.AIService;
import com.practisespring.Practise_spring.service.PDFService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/document")
@CrossOrigin(origins = "http://localhost:4200")
public class DocumentController {

    private final PDFService pdfService;
    private final AIService aiService;
    private final PdfSessionRepository sessionRepo;

    public DocumentController(PDFService pdfService, AIService aiService, PdfSessionRepository sessionRepo) {
        this.pdfService = pdfService;
        this.aiService = aiService;
        this.sessionRepo = sessionRepo;
    }

//    @PostMapping("/upload")
//    public ResponseEntity<Map<String, Object>> upload(@RequestParam("file") MultipartFile file, @RequestParam("fileHash") String fileHash) throws Exception {
//        String text = pdfService.extractText(file);
//
//        PdfSession session = new PdfSession();
//        session.setFilename(file.getOriginalFilename());
//        session.setDocumentText(text);
//        sessionRepo.save(session);
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("sessionId", session.getId());
//        response.put("text", text);
//        return ResponseEntity.ok(response);
//    }
    @PostMapping("/upload")
    public ResponseEntity<?> uploadPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("fileHash") String fileHash) throws Exception {

        // Check if this PDF was already uploaded (by hash)
        Optional<PdfSession> existing = sessionRepo.findByFileHash(fileHash);
        if (existing.isPresent()) {
            PdfSession s = existing.get();
            return ResponseEntity.ok(Map.of(
                    "sessionId", s.getId(),
                    "text", s.getDocumentText(),
                    "duplicate", true
            ));
        }

        // New PDF — extract text and save
        String text = pdfService.extractText(file); // your existing method
        PdfSession session = new PdfSession();
        session.setFilename(file.getOriginalFilename());
        session.setDocumentText(text);
        session.setFileHash(fileHash);
        session.setUploadedAt(LocalDateTime.now());
        PdfSession saved = sessionRepo.save(session);

        return ResponseEntity.ok(Map.of(
                "sessionId", saved.getId(),
                "text", text,
                "duplicate", false
        ));
    }
    @PostMapping("/ask")
    public String ask(@RequestBody QuestionRequest request) {
        String answer = aiService.generateAnswer(request.getDocumentText(), request.getQuestion());

        sessionRepo.findById(request.getSessionId()).ifPresent(session -> {
            QaHistory qa = new QaHistory();
            qa.setQuestion(request.getQuestion());
            qa.setAnswer(answer);
            qa.setSession(session);
            session.getQaHistory().add(qa);
            sessionRepo.save(session);
        });

        return answer;
    }

    @GetMapping("/sessions")
    public List<PdfSession> getSessions() {
        return sessionRepo.findAll();
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<?> getSession(@PathVariable Long id) {
        return sessionRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id) {
        if (!sessionRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        sessionRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/quiz/generate")
    public ResponseEntity<List<QuizQuestion>> generateQuiz(@RequestBody QuestionRequest req) {
        String prompt = "Generate exactly 5 multiple choice questions from this text. " +
                "Return ONLY a JSON array, no explanation. Format: " +
                "[{\"question\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correctIndex\":0},...]\n\n"
                + req.getDocumentText();

        String raw;
        try {
            raw = aiService.generateAnswer(req.getDocumentText(), prompt);
        } catch (Exception e) {
            // retry once after short wait
            try {
                Thread.sleep(2000);
                raw = aiService.generateAnswer(req.getDocumentText(), prompt);
            } catch (Exception ex) {
                return ResponseEntity.status(503).build();
            }
        }
        // parse JSON from AI response
        try {
            ObjectMapper mapper = new ObjectMapper();
            // extract JSON array from response (AI may wrap it in text)
            int start = raw.indexOf('[');
            int end = raw.lastIndexOf(']') + 1;
            String json = raw.substring(start, end);
            List<QuizQuestion> questions = mapper.readValue(json,
                    mapper.getTypeFactory().constructCollectionType(List.class, QuizQuestion.class));
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }



    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @PostMapping("/quiz/attempt")
    public ResponseEntity<?> saveAttempt(@RequestBody QuizAttemptRequest req) throws Exception {
        return sessionRepo.findById(req.getSessionId()).map(session -> {
            session.setQuizAttempts(session.getQuizAttempts() + 1);
            sessionRepo.save(session);

            QuizAttempt attempt = new QuizAttempt();
            attempt.setSession(session);
            attempt.setAttemptNumber(session.getQuizAttempts());
            attempt.setScore(req.getScore());
            attempt.setTotal(req.getTotal());
            attempt.setAttemptedAt(LocalDateTime.now());
            try {
                attempt.setQuestionsJson(new ObjectMapper().writeValueAsString(req.getQuestions()));
            } catch (Exception e) { attempt.setQuestionsJson("[]"); }
            quizAttemptRepository.save(attempt);

            return ResponseEntity.ok(Map.of(
                    "totalAttempts", session.getQuizAttempts(),
                    "attemptId", attempt.getId()
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/quiz/history/{sessionId}")
    public ResponseEntity<?> getQuizHistory(@PathVariable Long sessionId) throws Exception {
        List<QuizAttempt> attempts = quizAttemptRepository
                .findBySessionIdOrderByAttemptNumberAsc(sessionId);

        ObjectMapper mapper = new ObjectMapper();
        List<Map<String, Object>> result = new ArrayList<>();
        for (QuizAttempt a : attempts) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", a.getId());
            map.put("attemptNumber", a.getAttemptNumber());
            map.put("score", a.getScore());
            map.put("total", a.getTotal());
            map.put("attemptedAt", a.getAttemptedAt());
            map.put("questions", mapper.readValue(a.getQuestionsJson(), List.class));
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

}